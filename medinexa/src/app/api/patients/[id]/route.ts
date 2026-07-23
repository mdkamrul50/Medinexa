import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getSession } from "@/lib/server/auth";
import { getDB } from "@/lib/server/db";

const PATIENT_UPDATABLE_FIELDS = [
  "name", "email", "phone", "image", "gender", "dateOfBirth",
  "bloodGroup", "height", "weight", "emergencyContact", "address",
  "assignedDoctor", "medicalHistory", "allergies", "currentMedications", "status",
];

function pickPatientFields(body: Record<string, unknown>) {
  const picked: Record<string, unknown> = {};
  for (const key of PATIENT_UPDATABLE_FIELDS) {
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
      return NextResponse.json({ message: "Invalid patient ID format" }, { status: 400 });
    }

    const db = await getDB();
    const patient = await db.collection("patients").findOne({ _id: new ObjectId(id) });
    if (!patient) {
      return NextResponse.json({ message: "Patient not found" }, { status: 404 });
    }

    if (session.user.role === "patient" && patient.userId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(patient);
  } catch {
    return NextResponse.json({ message: "Failed to fetch patient" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession(request.headers);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const allowedRoles = ["admin", "doctor", "receptionist"];
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid patient ID format" }, { status: 400 });
    }

    const db = await getDB();

    if (session.user.role === "doctor") {
      const patient = await db.collection("patients").findOne({ _id: new ObjectId(id) });
      if (!patient) {
        return NextResponse.json({ message: "Patient not found" }, { status: 404 });
      }
      if (patient.assignedDoctor !== session.user.id && patient.assignedDoctor !== session.user.name) {
        return NextResponse.json({ message: "You can only update your assigned patients" }, { status: 403 });
      }
    }

    const body = await request.json();
    const updateData = { ...pickPatientFields(body), updatedAt: new Date().toISOString() };

    const result = await db.collection("patients").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Patient not found" }, { status: 404 });
    }

    const updated = await db.collection("patients").findOne({ _id: new ObjectId(id) });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ message: "Failed to update patient" }, { status: 500 });
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
      return NextResponse.json({ message: "Invalid patient ID format" }, { status: 400 });
    }

    const db = await getDB();
    const patient = await db.collection("patients").findOne({ _id: new ObjectId(id) });
    if (!patient) {
      return NextResponse.json({ message: "Patient not found" }, { status: 404 });
    }

    await db.collection("patients").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: "Patient deleted successfully" });
  } catch {
    return NextResponse.json({ message: "Failed to delete patient" }, { status: 500 });
  }
}
