"use client";

import { useMemo } from "react";
import {
  FiUsers,
  FiUserCheck,
  FiCalendar,
  FiGrid,
  FiDollarSign,
  FiShield,
  FiUserPlus,
  FiActivity,
  FiBarChart2,
  FiSettings,
  FiFileText,
} from "react-icons/fi";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PageContainer from "@/components/dashboard/PageContainer";
import RoleGuard from "@/components/auth/RoleGuard";
import StatCard from "@/components/dashboard/StatCard";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import DashboardSection from "@/components/dashboard/DashboardSection";
import ActivityTimeline from "@/components/dashboard/ActivityTimeline";
import DataTable from "@/components/dashboard/DataTable";
import QuickActionCard from "@/components/dashboard/QuickActionCard";
import StaggerContainer from "@/components/dashboard/StaggerContainer";
import { useUser } from "@/hooks/useUser";
import { useAdminDashboard } from "@/hooks/useDashboardData";
import type { AppointmentItem, RegistrationItem } from "@/hooks/useDashboardData";
import type { UserRole } from "@/lib/auth-utils";
import type { IconType } from "react-icons";

const statusColor: Record<string, string> = {
  scheduled: "bg-blue-500/10 text-blue-500",
  "checked-in": "bg-amber-500/10 text-amber-500",
  completed: "bg-emerald-500/10 text-emerald-500",
  cancelled: "bg-red-500/10 text-red-500",
};

function AppointmentRow({ item }: { item: AppointmentItem }) {
  return (
    <>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-heading truncate">{item.patient}</p>
        <p className="text-xs text-muted">{item.type}</p>
      </div>
      <span className="text-sm font-medium text-primary">{item.time}</span>
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${statusColor[item.status] ?? ""}`}>
        {item.status}
      </span>
    </>
  );
}

function RegistrationRow({ item }: { item: RegistrationItem }) {
  return (
    <>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-heading truncate">{item.name}</p>
        <p className="text-xs text-muted">{item.email}</p>
      </div>
      <span className="text-xs text-muted">{item.date}</span>
      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize bg-slate-100 dark:bg-slate-700 text-muted">
        {item.role}
      </span>
    </>
  );
}

export default function AdminDashboardPage() {
  const { user } = useUser();
  const { data, loading, error } = useAdminDashboard();

  const firstName = user?.name?.split(" ")[0] ?? "Admin";

  const quickActions = useMemo(
    () => [
      { label: "New Patient", icon: FiUserPlus, color: "from-blue-500 to-primary", href: "/dashboard/patients" },
      { label: "Reports", icon: FiBarChart2, color: "from-teal-500 to-secondary", href: "/dashboard/reports" },
      { label: "Settings", icon: FiSettings, color: "from-amber-500 to-accent", href: "/dashboard/settings" },
      { label: "Activity Log", icon: FiFileText, color: "from-violet-500 to-purple-500", href: "/dashboard/reports" },
    ],
    []
  );

  const statCards: { label: string; icon: IconType; color: string; key: string }[] = [
    { label: "Total Patients", icon: FiUsers, color: "from-blue-500 to-primary", key: "totalPatients" },
    { label: "Active Doctors", icon: FiUserCheck, color: "from-teal-500 to-secondary", key: "activeDoctors" },
    { label: "Today's Appointments", icon: FiCalendar, color: "from-amber-500 to-accent", key: "todayAppointments" },
    { label: "Departments", icon: FiGrid, color: "from-violet-500 to-purple-500", key: "departments" },
  ];

  return (
    <RoleGuard roles={["admin"]}>
      <DashboardLayout>
        <PageContainer
          title="Admin Dashboard"
          subtitle={`Full system overview.`}
          breadcrumbs={[{ label: "Dashboard" }]}
        >
          <StaggerContainer className="space-y-6">
            <WelcomeBanner
              name={user?.name ?? "Admin"}
              role={(user?.role as UserRole) ?? "admin"}
              icon={FiShield}
              title={`Welcome back, ${firstName}`}
              description="You have full system access and control. Monitor and manage all hospital operations."
            />

            {error && (
              <div className="rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((card) => {
                const stat = data?.stats?.find((s) => s.label === card.label);
                return (
                  <StatCard
                    key={card.label}
                    label={card.label}
                    value={stat?.value ?? 0}
                    icon={card.icon}
                    color={card.color}
                    loading={loading}
                    trend={stat?.trend}
                    prefix={stat?.prefix}
                    suffix={stat?.suffix}
                  />
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DashboardSection
                title="Today's Appointments"
                subtitle={loading ? "" : `${data?.todayAppointments?.length ?? 0} appointments today`}
              >
                <DataTable
                  columns={[
                    { key: "info", header: "", render: (item: AppointmentItem) => <AppointmentRow item={item} />, className: "flex items-center gap-3 w-full" },
                  ]}
                  data={data?.todayAppointments ?? []}
                  loading={loading}
                  keyExtractor={(item) => item.id}
                  emptyTitle="No appointments today"
                  emptyDescription="Scheduled appointments will appear here."
                />
              </DashboardSection>

              <DashboardSection
                title="Recent Registrations"
                subtitle={loading ? "" : `${data?.recentRegistrations?.length ?? 0} new registrations`}
              >
                <DataTable
                  columns={[
                    { key: "info", header: "", render: (item: RegistrationItem) => <RegistrationRow item={item} />, className: "flex items-center gap-3 w-full" },
                  ]}
                  data={data?.recentRegistrations ?? []}
                  loading={loading}
                  keyExtractor={(item) => item.id}
                  emptyTitle="No recent registrations"
                  emptyDescription="New user registrations will appear here."
                />
              </DashboardSection>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <DashboardSection title="Recent Activity">
                  <ActivityTimeline
                    items={data?.recentActivities ?? []}
                    loading={loading}
                  />
                </DashboardSection>
              </div>
              <div>
                <DashboardSection title="Quick Actions">
                  <QuickActionCard actions={quickActions} />
                </DashboardSection>
                {data?.stats && data.stats.length > 0 && (
                  <DashboardSection
                    title="Revenue Overview"
                    className="mt-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                        <FiDollarSign className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm text-muted">Monthly Revenue</p>
                        <p className="text-2xl font-extrabold text-heading">
                          ${(data.stats[data.stats.length - 1]?.value ?? 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </DashboardSection>
                )}
              </div>
            </div>
          </StaggerContainer>
        </PageContainer>
      </DashboardLayout>
    </RoleGuard>
  );
}
