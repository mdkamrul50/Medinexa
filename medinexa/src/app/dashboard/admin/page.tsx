"use client";

import { motion } from "framer-motion";
import { FiUsers, FiUserCheck, FiCalendar, FiDollarSign, FiShield } from "react-icons/fi";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PageContainer from "@/components/dashboard/PageContainer";
import RoleGuard from "@/components/auth/RoleGuard";
import { useUser } from "@/hooks/useUser";

function StatCard({ label, value, change, color }: { label: string; value: string; change: string; color: string }) {
  return (
    <div className="group relative rounded-2xl border border-border bg-card p-6 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-300">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300" />
      <p className="text-sm font-semibold text-muted">{label}</p>
      <p className="text-3xl font-extrabold text-heading tracking-tight mt-1">{value}</p>
      <div className="flex items-center gap-1.5 mt-2">
        <div className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${color}`} />
        <span className="text-xs font-medium text-body">{change}</span>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { user } = useUser();

  return (
    <RoleGuard roles={["admin"]}>
      <DashboardLayout>
        <PageContainer
          title="Admin Dashboard"
          subtitle={`Welcome back, ${user?.name?.split(" ")[0] ?? "Admin"}. Full system overview.`}
          breadcrumbs={[{ label: "Dashboard" }]}
        >
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border bg-card p-6 sm:p-8"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-500">
                  <FiShield className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-heading">Administrator Access</h2>
                  <p className="text-sm text-body mt-0.5">You have full system access and control.</p>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Total Patients" value="12,840" change="+12.5%" color="from-blue-500 to-primary" />
              <StatCard label="Active Doctors" value="164" change="+8 this month" color="from-teal-500 to-secondary" />
              <StatCard label="Today's Appointments" value="48" change="+8 today" color="from-amber-500 to-accent" />
              <StatCard label="Revenue (MTD)" value="$284.5K" change="+18.2%" color="from-violet-500 to-purple-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-base font-bold text-heading mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    { action: "New patient registered", time: "2 min ago" },
                    { action: "Appointment completed", time: "15 min ago" },
                    { action: "Payment received", time: "1 hour ago" },
                    { action: "New doctor onboarded", time: "3 hours ago" },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                      <span className="text-sm font-medium text-heading">{activity.action}</span>
                      <span className="text-xs text-muted">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-base font-bold text-heading mb-4">Department Overview</h3>
                <div className="space-y-3">
                  {[
                    { dept: "Cardiology", patients: 1240, color: "bg-blue-500" },
                    { dept: "Neurology", patients: 890, color: "bg-emerald-500" },
                    { dept: "Pediatrics", patients: 2100, color: "bg-amber-500" },
                    { dept: "Orthopedics", patients: 760, color: "bg-purple-500" },
                  ].map((dept, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-heading">{dept.dept}</span>
                      <span className="text-sm text-body">{dept.patients.toLocaleString()} patients</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </DashboardLayout>
    </RoleGuard>
  );
}
