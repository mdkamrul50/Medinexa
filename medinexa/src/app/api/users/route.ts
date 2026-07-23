import { NextResponse } from "next/server";
import { getSession } from "@/lib/server/auth";
import { getDB } from "@/lib/server/db";

export async function GET() {
  try {
    const session = await getSession(
      await import("next/headers").then((m) => m.headers())
    );
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const db = await getDB();
    const users = await db
      .collection("users")
      .find(
        {},
        { projection: { _id: 1, name: 1, email: 1, emailVerified: 1, role: 1, createdAt: 1, updatedAt: 1 } }
      )
      .sort({ createdAt: -1 })
      .toArray();

    const total = await db.collection("users").countDocuments();
    return NextResponse.json({ total, users });
  } catch {
    return NextResponse.json({ message: "Failed to fetch users" }, { status: 500 });
  }
}
