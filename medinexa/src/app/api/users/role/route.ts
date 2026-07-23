import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/server/auth";
import { getDB } from "@/lib/server/db";

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession(
      await import("next/headers").then((m) => m.headers())
    );
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { userId, role } = await request.json();
    if (!userId || !role) {
      return NextResponse.json({ message: "userId and role are required" }, { status: 400 });
    }

    const validRoles = ["admin", "doctor", "patient", "receptionist"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    const db = await getDB();
    const result = await db.collection("users").updateOne({ _id: userId }, { $set: { role } });

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Role updated successfully" });
  } catch {
    return NextResponse.json({ message: "Failed to update role" }, { status: 500 });
  }
}
