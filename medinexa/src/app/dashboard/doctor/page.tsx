"use client";

import { FiUsers, FiCalendar, FiFileText, FiClock } from "react-icons/fi";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PageContainer from "@/components/dashboard/PageContainer";
import RoleGuard from "@/components/auth/RoleGuard";
import { useUser } from "@/hooks/useUser";

export default function DoctorDashboardPage() {
  const { user } = useUser();

  return (
    <RoleGuard roles={["doctor"]}>
      <DashboardLayout>
        <PageContainer
          title="Doctor Dashboard"
          subtitle={`Welcome back, Dr. ${user?.name?.split(" ")[0] ?? "Doctor"}. Here are your patients and schedule.`}
          breadcrumbs={[{ label: "Dashboard" }]}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "My Patients", value: "156", icon: FiUsers, color: "from-blue-500 to-primary" },
              { label: "Today's Appointments", value: "8", icon: FiCalendar, color: "from-teal-500 to-secondary" },
              { label: "Pending Reports", value: "12", icon: FiFileText, color: "from-amber-500 to-accent" },
              { label: "Next Appointment", value: "2:30 PM", icon: FiClock, color: "from-violet-500 to-purple-500" },
            ].map((stat, i) => (
              <div key={i} className="group relative rounded-2xl border border-border bg-card p-6 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} text-white`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-sm font-semibold text-muted">{stat.label}</p>
                <p className="text-3xl font-extrabold text-heading tracking-tight mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-base font-bold text-heading mb-4">Upcoming Appointments</h3>
              <div className="space-y-3">
                {[
                  { patient: "Sarah Johnson", time: "2:30 PM", type: "Check-up" },
                  { patient: "Michael Chen", time: "3:00 PM", type: "Follow-up" },
                  { patient: "Emily Davis", time: "4:15 PM", type: "Consultation" },
                ].map((apt, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/30 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-heading">{apt.patient}</p>
                      <p className="text-xs text-muted">{apt.type}</p>
                    </div>
                    <span className="text-sm font-medium text-primary">{apt.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-base font-bold text-heading mb-4">Recent Patients</h3>
              <div className="space-y-3">
                {[
                  { name: "Robert Wilson", condition: "Hypertension", date: "Today" },
                  { name: "Amanda Lee", condition: "Diabetes Type 2", date: "Yesterday" },
                  { name: "James Brown", condition: "Annual Check-up", date: "2 days ago" },
                ].map((p, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-heading">{p.name}</p>
                      <p className="text-xs text-muted">{p.condition}</p>
                    </div>
                    <span className="text-xs text-muted">{p.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PageContainer>
      </DashboardLayout>
    </RoleGuard>
  );
}
