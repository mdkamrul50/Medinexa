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
    if (session.user.role !== "receptionist" && session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      queue: [],
      scheduledAppointments: [],
      newRegistrations: [],
      pendingBilling: [],
    });
  } catch {
    return NextResponse.json({ message: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
