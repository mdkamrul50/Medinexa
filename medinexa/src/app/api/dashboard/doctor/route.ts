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
      stats: [
        { label: "My Patients", value: 0, suffix: "", prefix: "" },
        { label: "Today's Appointments", value: 0, suffix: "", prefix: "" },
        { label: "Pending Prescriptions", value: 0, suffix: "", prefix: "" },
        { label: "Next Appointment", value: 0, suffix: "", prefix: "" },
      ],
      todaySchedule: [],
      upcomingAppointments: [],
      recentPatients: [],
    });
  } catch {
    return NextResponse.json({ message: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
