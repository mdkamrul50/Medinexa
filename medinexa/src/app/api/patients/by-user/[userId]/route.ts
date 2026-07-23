import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/server/auth";
import { getDB } from "@/lib/server/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getSession(_request.headers);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await params;
    const isAdmin = session.user.role === "admin";
    const isReceptionist = session.user.role === "receptionist";
    const isOwnRecord = session.user.id === userId;

    if (!isAdmin && !isReceptionist && !isOwnRecord) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const db = await getDB();
    const patient = await db.collection("patients").findOne({ userId });
    if (!patient) {
      return NextResponse.json({ message: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json(patient);
  } catch {
    return NextResponse.json({ message: "Failed to fetch patient" }, { status: 500 });
  }
}
