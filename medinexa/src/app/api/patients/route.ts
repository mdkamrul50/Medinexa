import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getAuth, getSession } from "@/lib/server/auth";
import { getDB } from "@/lib/server/db";
import { escapeRegex, sanitizeSortField } from "@/lib/server/query-utils";

const PATIENT_UPDATABLE_FIELDS = [
  "name", "email", "phone", "image", "gender", "dateOfBirth",
  "bloodGroup", "height", "weight", "emergencyContact", "address",
  "assignedDoctor", "medicalHistory", "allergies", "currentMedications", "status",
];

const PATIENT_SORT_FIELDS = [
  "name", "email", "createdAt", "updatedAt", "bloodGroup", "status",
];

function pickPatientFields(body: Record<string, unknown>) {
  const picked: Record<string, unknown> = {};
  for (const key of PATIENT_UPDATABLE_FIELDS) {
    if (body[key] !== undefined) picked[key] = body[key];
  }
  return picked;
}

function validatePassword(password: unknown): string | null {
  if (!password || typeof password !== "string") return "Password is required";
  if (password.length < 5) return "Password must be at least 5 characters";
  if (!/[a-zA-Z]/.test(password)) return "Password must contain at least one letter";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number";
  return null;
}

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
      query.$or = [
        { assignedDoctor: session.user.id },
        { assignedDoctor: session.user.name },
      ];
    }

    if (search.trim()) {
      const escaped = escapeRegex(search.trim());
      const searchQuery = { $regex: escaped, $options: "i" };
      if (query.$or) {
        query.$and = [
          { $or: query.$or as object[] },
          { $or: [{ name: searchQuery }, { email: searchQuery }] },
        ];
        delete query.$or;
      } else {
        query.$or = [{ name: searchQuery }, { email: searchQuery }];
      }
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

    return NextResponse.json({ patients, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
  } catch {
    return NextResponse.json({ message: "Failed to fetch patients" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
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

    const patientDoc = {
      ...pickPatientFields(rest),
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await db.collection("patients").insertOne(patientDoc);
    return NextResponse.json({ ...patientDoc, _id: result.insertedId }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Failed to create patient. Email may already be in use." }, { status: 400 });
  }
}
