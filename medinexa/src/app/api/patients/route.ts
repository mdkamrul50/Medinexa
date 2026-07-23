import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getAuth, getSession } from "@/lib/server/auth";
import { getDB } from "@/lib/server/db";
import { escapeRegex, sanitizeSortField, validatePassword, pickPatientFields, PATIENT_SORT_FIELDS } from "@/lib/server/validation";
import { rateLimit, getRateLimitHeaders, getClientIp } from "@/lib/server/rate-limit";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request.headers);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const db = await getDB();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const bloodGroup = searchParams.get("bloodGroup") || "";
    const status = searchParams.get("status") || "";
    const assignedDoctor = searchParams.get("assignedDoctor") || "";
    const sortBy = sanitizeSortField(searchParams.get("sortBy") || "createdAt", PATIENT_SORT_FIELDS);
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const query: Record<string, unknown> = {};

    if (session.user.role === "patient") {
      const patientDoc = await db.collection("patients").findOne({ userId: session.user.id });
      if (!patientDoc) {
        return NextResponse.json({ patients: [], total: 0, page: 1, totalPages: 0 });
      }
      query._id = patientDoc._id;
    } else if (session.user.role === "doctor") {
      query.assignedDoctor = session.user.id;
    }

    if (search.trim()) {
      const escaped = escapeRegex(search.trim());
      const searchQuery = { $regex: escaped, $options: "i" };
      query.$or = [{ name: searchQuery }, { email: searchQuery }];
    }
    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (status) query.status = status;
    if (assignedDoctor && session.user.role !== "patient") query.assignedDoctor = assignedDoctor;

    const pageNum = Math.max(1, page);
    const limitNum = Math.min(100, Math.max(1, limit));
    const skip = (pageNum - 1) * limitNum;

    const total = await db.collection("patients").countDocuments(query);
    const patients = await db.collection("patients")
      .find(query)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(limitNum)
      .toArray();

    const doctorUserIds = [...new Set(patients.map((p) => p.assignedDoctor).filter(Boolean))];
    const doctorNameMap: Record<string, string> = {};
    if (doctorUserIds.length > 0) {
      const doctors = await db.collection("doctors")
        .find({ userId: { $in: doctorUserIds } })
        .project({ userId: 1, name: 1 })
        .toArray();
      for (const doc of doctors) {
        doctorNameMap[doc.userId] = doc.name;
      }
    }

    const enrichedPatients = patients.map((p) => ({
      ...p,
      assignedDoctorName: p.assignedDoctor ? doctorNameMap[p.assignedDoctor] || "Unknown" : null,
    }));

    return NextResponse.json({ patients: enrichedPatients, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
  } catch {
    return NextResponse.json({ message: "Failed to fetch patients" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rl = rateLimit(`create:patient:${ip}`, 20, 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { message: "Rate limit exceeded" },
        { status: 429, headers: getRateLimitHeaders(rl, 20) }
      );
    }

    const auth = await getAuth();
    const session = await getSession(request.headers);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const allowedRoles = ["admin", "receptionist"];
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = (await request.json()) as Record<string, unknown>;
    const { password, ...rest } = body;
    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json({ message: passwordError }, { status: 400 });
    }
    if (!rest.name || !rest.email) {
      return NextResponse.json({ message: "name and email are required" }, { status: 400 });
    }

    const db = await getDB();
    const existingUser = await db.collection("users").findOne({ email: rest.email });
    let userId: string;

    if (existingUser) {
      const existingRole = existingUser.role as string;
      if (existingRole === "admin") {
        return NextResponse.json({ message: "Cannot create a patient for an admin user" }, { status: 400 });
      }
      userId = existingUser._id.toString();
      await db.collection("users").updateOne({ _id: existingUser._id }, { $set: { role: "patient" } });
    } else {
      const { user: createdUser } = await auth.api.signUpEmail({
        body: { name: rest.name as string, email: rest.email as string, password: password as string },
        headers: request.headers,
      });
      userId = createdUser.id;
      await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: { role: "patient" } });
    }

    const now = new Date();
    const patientDoc = {
      ...pickPatientFields(rest),
      userId,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection("patients").insertOne(patientDoc);
    return NextResponse.json({ ...patientDoc, _id: result.insertedId }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Failed to create patient. Email may already be in use." }, { status: 400 });
  }
}
