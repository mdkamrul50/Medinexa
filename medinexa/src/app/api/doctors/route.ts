import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getAuth, getSession } from "@/lib/server/auth";
import { getDB } from "@/lib/server/db";
import { escapeRegex, sanitizeSortField, validatePassword, pickDoctorFields, DOCTOR_SORT_FIELDS } from "@/lib/server/validation";
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
    const department = searchParams.get("department") || "";
    const status = searchParams.get("status") || "";
    const sortBy = sanitizeSortField(searchParams.get("sortBy") || "createdAt", DOCTOR_SORT_FIELDS);
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const query: Record<string, unknown> = {};
    if (search.trim()) query.name = { $regex: escapeRegex(search.trim()), $options: "i" };
    if (department) query.department = department;
    if (status) query.status = status;

    const pageNum = Math.max(1, page);
    const limitNum = Math.min(100, Math.max(1, limit));
    const skip = (pageNum - 1) * limitNum;

    const total = await db.collection("doctors").countDocuments(query);
    const doctors = await db.collection("doctors")
      .find(query)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(limitNum)
      .toArray();

    return NextResponse.json({ doctors, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
  } catch {
    return NextResponse.json({ message: "Failed to fetch doctors" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rl = rateLimit(`create:doctor:${ip}`, 20, 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { message: "Rate limit exceeded" },
        { status: 429, headers: getRateLimitHeaders(rl, 20) }
      );
    }

    const auth = await getAuth();
    const session = await getSession(request.headers);
    if (!session || session.user.role !== "admin") {
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

    if (rest.rating !== undefined) {
      if (typeof rest.rating !== "number" || rest.rating < 0 || rest.rating > 5) {
        return NextResponse.json({ message: "Rating must be a number between 0 and 5" }, { status: 400 });
      }
    }

    const db = await getDB();
    const existingUser = await db.collection("users").findOne({ email: rest.email });
    let userId: string;

    if (existingUser) {
      const existingRole = existingUser.role as string;
      if (existingRole === "admin") {
        return NextResponse.json({ message: "Cannot create a doctor for an admin user" }, { status: 400 });
      }
      userId = existingUser._id.toString();
      await db.collection("users").updateOne({ _id: existingUser._id }, { $set: { role: "doctor" } });
    } else {
      const { user: createdUser } = await auth.api.signUpEmail({
        body: { name: rest.name as string, email: rest.email as string, password: password as string },
        headers: request.headers,
      });
      userId = createdUser.id;
      await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: { role: "doctor" } });
    }

    const now = new Date();
    const doctorDoc = {
      ...pickDoctorFields(rest),
      userId,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection("doctors").insertOne(doctorDoc);
    return NextResponse.json({ ...doctorDoc, _id: result.insertedId }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Failed to create doctor. Email may already be in use." }, { status: 400 });
  }
}
