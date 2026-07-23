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
    if (session.user.role !== "receptionist" && session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const db = await getDB();
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);
    const todayStartISO = todayStart.toISOString();
    const todayEndISO = todayEnd.toISOString();

    const queue = await db.collection("appointments")
      .find({ date: { $gte: todayStartISO, $lt: todayEndISO }, status: { $in: ["scheduled", "checked-in"] } })
      .sort({ date: 1 })
      .limit(10)
      .toArray()
      .catch(() => []);

    const scheduledRaw = await db.collection("appointments")
      .find({ date: { $gte: todayStartISO } })
      .sort({ date: 1 })
      .limit(10)
      .toArray()
      .catch(() => []);

    const recentUsers = await db.collection("users")
      .find({ createdAt: { $gte: todayStartISO } })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray()
      .catch(() => []);

    const pendingBills = await db.collection("payments")
      .find({ status: "pending" })
      .sort({ date: -1 })
      .limit(5)
      .toArray()
      .catch(() => []);

    return NextResponse.json({
      queue: queue.map((q, i) => ({
        id: q._id.toString(),
        patient: q.patient || "Unknown",
        token: i + 1,
        doctor: q.doctor || "",
        department: q.department || "",
        status: (q.status as "waiting" | "with-doctor" | "completed") || "waiting",
      })),
      scheduledAppointments: scheduledRaw.map((a) => ({
        id: a._id.toString(),
        patient: a.patient || "Unknown",
        doctor: a.doctor || "",
        department: a.department || "",
        type: a.type || "General",
        time: new Date(a.date).toLocaleTimeString(),
        date: new Date(a.date).toLocaleDateString(),
        status: (a.status as "scheduled" | "checked-in" | "completed" | "cancelled") || "scheduled",
      })),
      newRegistrations: recentUsers.map((u) => ({
        id: u._id.toString(),
        name: u.name || "",
        email: u.email || "",
        role: u.role || "",
        date: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "",
      })),
      pendingBilling: pendingBills.map((b) => ({
        id: b._id.toString(),
        patient: b.patientName || b.patient || "",
        description: b.description || "Consultation",
        amount: b.amount || 0,
        date: b.date ? new Date(b.date).toLocaleDateString() : "",
        status: (b.status as "paid" | "pending" | "overdue") || "pending",
      })),
    });
  } catch {
    return NextResponse.json({ message: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
