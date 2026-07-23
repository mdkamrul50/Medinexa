import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/server/auth";
import { getDB } from "@/lib/server/db";
import { ObjectId } from "mongodb";

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession(
      await import("next/headers").then((m) => m.headers())
    );
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, phone, address } = await request.json();
    if (!name && phone === undefined && address === undefined) {
      return NextResponse.json({ message: "At least one field is required" }, { status: 400 });
    }

    const db = await getDB();
    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;

    await db.collection("users").updateOne({ _id: new ObjectId(session.user.id) }, { $set: updateData });

    const updated = await db.collection("users").findOne(
      { _id: new ObjectId(session.user.id) },
      { projection: { _id: 0, name: 1, email: 1, phone: 1, address: 1, role: 1, image: 1, createdAt: 1, updatedAt: 1 } }
    );

    return NextResponse.json({ user: updated });
  } catch {
    return NextResponse.json({ message: "Failed to update profile" }, { status: 500 });
  }
}
