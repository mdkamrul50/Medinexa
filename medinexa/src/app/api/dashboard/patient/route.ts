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
    if (session.user.role !== "patient" && session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const db = await getDB();
    const now = new Date();
    const nowISO = now.toISOString();

    const patientDoc = await db.collection("patients").findOne({ userId: session.user.id });
    const patientId = patientDoc?._id?.toString();
    const patientName = patientDoc?.name || session.user.name;

    const upcomingRaw = patientId
      ? await db.collection("appointments")
          .find({ patientId, date: { $gte: nowISO } })
          .sort({ date: 1 })
          .limit(1)
          .toArray()
          .catch(() => [])
      : [];

    const historyRaw = patientId
      ? await db.collection("appointments")
          .find({ patientId, date: { $lt: nowISO } })
          .sort({ date: -1 })
          .limit(5)
          .toArray()
          .catch(() => [])
      : [];

    const prescriptions = await db.collection("prescriptions")
      .find({ userId: session.user.id, status: "active" })
      .limit(5)
      .toArray()
      .catch(() => []);

    const reports = await db.collection("medical_reports")
      .find({ userId: session.user.id })
      .sort({ date: -1 })
      .limit(5)
      .toArray()
      .catch(() => []);

    const payments = await db.collection("payments")
      .find({ userId: session.user.id })
      .sort({ date: -1 })
      .limit(5)
      .toArray()
      .catch(() => []);

    return NextResponse.json({
      upcomingAppointment: upcomingRaw[0]
        ? {
            id: upcomingRaw[0]._id.toString(),
            patient: patientName,
            doctor: upcomingRaw[0].doctor || "",
            department: upcomingRaw[0].department || "",
            type: upcomingRaw[0].type || "General",
            time: new Date(upcomingRaw[0].date).toLocaleTimeString(),
            date: new Date(upcomingRaw[0].date).toLocaleDateString(),
            status: upcomingRaw[0].status || "scheduled",
          }
        : null,
      appointmentHistory: historyRaw.map((a) => ({
        id: a._id.toString(),
        patient: patientName,
        doctor: a.doctor || "",
        department: a.department || "",
        type: a.type || "General",
        time: new Date(a.date).toLocaleTimeString(),
        date: new Date(a.date).toLocaleDateString(),
        status: a.status || "completed",
      })),
      activePrescriptions: prescriptions.map((p) => ({
        id: p._id.toString(),
        medication: p.medication || "",
        dosage: p.dosage || "",
        prescribedBy: p.doctorName || p.doctor || "",
        date: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "",
        status: (p.status as "active" | "completed" | "expired") || "active",
      })),
      medicalReports: reports.map((r) => ({
        id: r._id.toString(),
        title: r.title || "Report",
        doctor: r.doctorName || r.doctor || "",
        date: r.date ? new Date(r.date).toLocaleDateString() : "",
        type: r.type || "General",
      })),
      payments: payments.map((p) => ({
        id: p._id.toString(),
        description: p.description || "Payment",
        amount: p.amount || 0,
        date: p.date ? new Date(p.date).toLocaleDateString() : "",
        status: (p.status as "paid" | "pending" | "overdue") || "pending",
      })),
    });
  } catch {
    return NextResponse.json({ message: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
