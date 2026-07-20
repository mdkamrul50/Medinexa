"use client";

import { FiCalendar, FiUserPlus, FiDollarSign, FiUsers } from "react-icons/fi";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PageContainer from "@/components/dashboard/PageContainer";
import RoleGuard from "@/components/auth/RoleGuard";
import { useUser } from "@/hooks/useUser";

export default function ReceptionistDashboardPage() {
  const { user } = useUser();

  return (
    <RoleGuard roles={["receptionist"]}>
      <DashboardLayout>
        <PageContainer
          title="Reception Dashboard"
          subtitle={`Welcome back, ${user?.name?.split(" ")[0] ?? "Receptionist"}. Manage appointments and patients.`}
          breadcrumbs={[{ label: "Dashboard" }]}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Today's Appointments", value: "24", icon: FiCalendar, color: "from-blue-500 to-primary" },
              { label: "New Registrations", value: "8", icon: FiUserPlus, color: "from-teal-500 to-secondary" },
              { label: "Pending Check-ins", value: "5", icon: FiUsers, color: "from-amber-500 to-accent" },
              { label: "Today's Revenue", value: "$8,240", icon: FiDollarSign, color: "from-violet-500 to-purple-500" },
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
              <h3 className="text-base font-bold text-heading mb-4">Today's Schedule</h3>
              <div className="space-y-3">
                {[
                  { patient: "John Doe", time: "9:00 AM", doctor: "Dr. Wilson", status: "Checked in" },
                  { patient: "Jane Smith", time: "10:30 AM", doctor: "Dr. Chen", status: "Waiting" },
                  { patient: "Bob Johnson", time: "11:00 AM", doctor: "Dr. Davis", status: "Scheduled" },
                  { patient: "Alice Brown", time: "1:00 PM", doctor: "Dr. Wilson", status: "Scheduled" },
                ].map((apt, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/30 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-heading">{apt.patient}</p>
                      <p className="text-xs text-muted">{apt.doctor}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-primary">{apt.time}</p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        apt.status === "Checked in" ? "bg-emerald-500/10 text-emerald-500" :
                        apt.status === "Waiting" ? "bg-amber-500/10 text-amber-500" :
                        "bg-blue-500/10 text-blue-500"
                      }`}>{apt.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-base font-bold text-heading mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "New Patient", icon: FiUserPlus, color: "from-blue-500 to-primary" },
                  { label: "Schedule Appointment", icon: FiCalendar, color: "from-teal-500 to-secondary" },
                  { label: "Process Payment", icon: FiDollarSign, color: "from-amber-500 to-accent" },
                  { label: "Patient Lookup", icon: FiUsers, color: "from-violet-500 to-purple-500" },
                ].map((action, i) => (
                  <button key={i} className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-slate-50 dark:bg-slate-800/20 p-4 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:border-primary/30 transition-all cursor-pointer">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${action.color} text-white`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-semibold text-heading text-center">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </PageContainer>
      </DashboardLayout>
    </RoleGuard>
  );
}
