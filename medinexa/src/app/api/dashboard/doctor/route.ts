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
    if (session.user.role !== "doctor" && session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const db = await getDB();
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const myPatients = await db.collection("patients").countDocuments({
      assignedDoctor: session.user.id,
    });

    const todayAppointments = await db.collection("appointments").countDocuments({
      doctorId: session.user.id,
      date: { $gte: todayStart.toISOString(), $lt: todayEnd.toISOString() },
    });

    const pendingPrescriptions = await db.collection("prescriptions").countDocuments({
      doctorId: session.user.id,
      status: "active",
    }).catch(() => 0);

    const nextAppointment = await db.collection("appointments").findOne(
      { doctorId: session.user.id, date: { $gte: now.toISOString() } },
      { sort: { date: 1 }, projection: { date: 1, patient: 1 } }
    ).catch(() => null);

    const upcomingRaw = await db.collection("appointments")
      .find({ doctorId: session.user.id, date: { $gte: todayStart.toISOString() } })
      .sort({ date: 1 })
      .limit(5)
      .toArray()
      .catch(() => []);

    const recentPatients = await db.collection("patients")
      .find({ assignedDoctor: session.user.id })
      .sort({ updatedAt: -1 })
      .limit(5)
      .toArray();

    const stats = [
      { label: "My Patients", value: myPatients, suffix: "", prefix: "" },
      { label: "Today's Appointments", value: todayAppointments, suffix: "", prefix: "" },
      { label: "Pending Prescriptions", value: pendingPrescriptions, suffix: "", prefix: "" },
      { label: "Next Appointment", value: nextAppointment ? 1 : 0, suffix: nextAppointment ? ` at ${new Date(nextAppointment.date).toLocaleTimeString()}` : "", prefix: "" },
    ];

    return NextResponse.json({
      stats,
      todaySchedule: upcomingRaw.map((a) => ({
        id: a._id.toString(),
        patient: a.patient || "Unknown",
        doctor: session.user.name,
        department: a.department || "",
        type: a.type || "General",
        time: a.date ? new Date(a.date).toLocaleTimeString() : "",
        date: a.date ? new Date(a.date).toLocaleDateString() : "",
        status: a.status || "scheduled",
      })),
      upcomingAppointments: upcomingRaw.map((a) => ({
        id: a._id.toString(),
        patient: a.patient || "Unknown",
        doctor: session.user.name,
        department: a.department || "",
        type: a.type || "General",
        time: a.date ? new Date(a.date).toLocaleTimeString() : "",
        date: a.date ? new Date(a.date).toLocaleDateString() : "",
        status: a.status || "scheduled",
      })),
      recentPatients: recentPatients.map((p) => ({
        id: p._id.toString(),
        name: p.name || "Unknown",
        condition: p.medicalHistory || "",
        date: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : "",
        status: p.status || "active",
      })),
    });
  } catch {
    return NextResponse.json({ message: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
