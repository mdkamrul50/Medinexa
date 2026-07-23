import { NextResponse } from "next/server";
import { getSession } from "@/lib/server/auth";

export async function GET() {
  try {
    const session = await getSession(
      await import("next/headers").then((m) => m.headers())
    );
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      upcomingAppointment: null,
      appointmentHistory: [],
      activePrescriptions: [],
      medicalReports: [],
      payments: [],
    });
  } catch {
    return NextResponse.json({ message: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
