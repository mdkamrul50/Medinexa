import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getSession } from "@/lib/server/auth";
import { getDB } from "@/lib/server/db";

const DOCTOR_UPDATABLE_FIELDS = [
  "name", "email", "phone", "image", "gender", "dateOfBirth",
  "department", "specialization", "qualifications", "experience",
  "consultationFee", "availableDays", "availableTime", "hospitalBranch",
  "biography", "status", "rating",
];

function pickDoctorFields(body: Record<string, unknown>) {
  const picked: Record<string, unknown> = {};
  for (const key of DOCTOR_UPDATABLE_FIELDS) {
    if (body[key] !== undefined) picked[key] = body[key];
  }
  return picked;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession(_request.headers);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid doctor ID format" }, { status: 400 });
    }

    const db = await getDB();
    const doctor = await db.collection("doctors").findOne({ _id: new ObjectId(id) });
    if (!doctor) {
      return NextResponse.json({ message: "Doctor not found" }, { status: 404 });
    }

    return NextResponse.json(doctor);
  } catch {
    return NextResponse.json({ message: "Failed to fetch doctor" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession(request.headers);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid doctor ID format" }, { status: 400 });
    }
    const db = await getDB();
    const body = await request.json();
    const updateData = { ...pickDoctorFields(body), updatedAt: new Date().toISOString() };

    const result = await db.collection("doctors").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Doctor not found" }, { status: 404 });
    }

    const updated = await db.collection("doctors").findOne({ _id: new ObjectId(id) });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ message: "Failed to update doctor" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession(_request.headers);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid doctor ID format" }, { status: 400 });
    }

    const db = await getDB();
    const doctor = await db.collection("doctors").findOne({ _id: new ObjectId(id) });
    if (!doctor) {
      return NextResponse.json({ message: "Doctor not found" }, { status: 404 });
    }

    await db.collection("doctors").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: "Doctor deleted successfully" });
  } catch {
    return NextResponse.json({ message: "Failed to delete doctor" }, { status: 500 });
  }
}
