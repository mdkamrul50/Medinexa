"use client";

import { FiCalendar, FiFileText, FiClock, FiUser } from "react-icons/fi";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PageContainer from "@/components/dashboard/PageContainer";
import RoleGuard from "@/components/auth/RoleGuard";
import { useUser } from "@/hooks/useUser";

export default function PatientDashboardPage() {
  const { user } = useUser();

  return (
    <RoleGuard roles={["patient"]}>
      <DashboardLayout>
        <PageContainer
          title="My Dashboard"
          subtitle={`Welcome back, ${user?.name?.split(" ")[0] ?? "Patient"}. Manage your healthcare.`}
          breadcrumbs={[{ label: "Dashboard" }]}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Next Appointment", value: "Mar 15", icon: FiCalendar, color: "from-blue-500 to-primary" },
              { label: "Total Visits", value: "12", icon: FiClock, color: "from-teal-500 to-secondary" },
              { label: "Prescriptions", value: "3", icon: FiFileText, color: "from-amber-500 to-accent" },
              { label: "My Profile", value: "Completed", icon: FiUser, color: "from-violet-500 to-purple-500" },
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
                  { doctor: "Dr. Sarah Wilson", dept: "Cardiology", date: "Mar 15, 2026", time: "10:30 AM" },
                  { doctor: "Dr. Michael Chen", dept: "General", date: "Mar 22, 2026", time: "2:00 PM" },
                ].map((apt, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/30 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-heading">{apt.doctor}</p>
                      <p className="text-xs text-muted">{apt.dept}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-primary">{apt.date}</p>
                      <p className="text-xs text-muted">{apt.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-base font-bold text-heading mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { action: "Prescription refilled", date: "2 days ago" },
                  { action: "Appointment rescheduled", date: "5 days ago" },
                  { action: "Lab results available", date: "1 week ago" },
                  { action: "Profile updated", date: "2 weeks ago" },
                ].map((act, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <span className="text-sm font-medium text-heading">{act.action}</span>
                    <span className="text-xs text-muted">{act.date}</span>
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
