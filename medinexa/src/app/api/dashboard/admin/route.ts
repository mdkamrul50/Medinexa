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

    const db = await getDB();
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const totalPatients = await db.collection("patients").countDocuments();
    const activeDoctors = await db.collection("doctors").countDocuments({ status: "active" });
    const todayAppointments = await db.collection("appointments").countDocuments({
      date: { $gte: todayStart.toISOString() },
    });
    const departments = await db.collection("departments").countDocuments();
    const recentRegistrations = await db
      .collection("users")
      .find({}, { projection: { name: 1, email: 1, role: 1, createdAt: 1 }, sort: { createdAt: -1 }, limit: 5 })
      .toArray();

    const stats = [
      { label: "Total Patients", value: totalPatients, suffix: "", prefix: "" },
      { label: "Active Doctors", value: activeDoctors, suffix: "", prefix: "" },
      { label: "Today's Appointments", value: todayAppointments, suffix: "", prefix: "" },
      { label: "Departments", value: departments, suffix: "", prefix: "" },
    ];

    return NextResponse.json({
      stats,
      todayAppointments: [],
      recentRegistrations: recentRegistrations.map((r) => ({
        id: r._id.toString(),
        name: r.name,
        email: r.email,
        role: r.role,
        date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "",
      })),
      recentActivities: [],
    });
  } catch {
    return NextResponse.json({ message: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
