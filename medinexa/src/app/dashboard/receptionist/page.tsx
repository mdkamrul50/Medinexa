"use client";

import { useMemo } from "react";
import {
  FiCalendar,
  FiUserPlus,
  FiDollarSign,
  FiUsers,
  FiClock,
  FiList,
  FiSearch,
  FiFileText,
} from "react-icons/fi";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PageContainer from "@/components/dashboard/PageContainer";
import RoleGuard from "@/components/auth/RoleGuard";
import StatCard from "@/components/dashboard/StatCard";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import DashboardSection from "@/components/dashboard/DashboardSection";
import DataTable from "@/components/dashboard/DataTable";
import QuickActionCard from "@/components/dashboard/QuickActionCard";
import StaggerContainer from "@/components/dashboard/StaggerContainer";
import { useUser } from "@/hooks/useUser";
import { useReceptionistDashboard } from "@/hooks/useDashboardData";
import type { QueueItem, AppointmentItem, RegistrationItem, BillingItem } from "@/hooks/useDashboardData";
import type { UserRole } from "@/lib/auth-utils";

const queueStatusColor: Record<string, string> = {
  waiting: "bg-blue-500/10 text-blue-500",
  "with-doctor": "bg-amber-500/10 text-amber-500",
  completed: "bg-emerald-500/10 text-emerald-500",
};

function QueueRow({ item }: { item: QueueItem }) {
  return (
    <>
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-bold">
          {item.token}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-heading truncate">{item.patient}</p>
          <p className="text-xs text-muted">{item.doctor} • {item.department}</p>
        </div>
      </div>
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${queueStatusColor[item.status] ?? ""}`}>
        {item.status === "with-doctor" ? "With Doctor" : item.status}
      </span>
    </>
  );
}

function AppointmentRow({ item }: { item: AppointmentItem }) {
  return (
    <>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-heading truncate">{item.patient}</p>
        <p className="text-xs text-muted">{item.doctor ?? item.type}</p>
      </div>
      <span className="text-sm font-medium text-primary">{item.time}</span>
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
        item.status === "scheduled" ? "bg-blue-500/10 text-blue-500" :
        item.status === "checked-in" ? "bg-amber-500/10 text-amber-500" :
        item.status === "completed" ? "bg-emerald-500/10 text-emerald-500" :
        "bg-red-500/10 text-red-500"
      }`}>
        {item.status === "checked-in" ? "Checked In" : item.status}
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
    </>
  );
}

function BillingRow({ item }: { item: BillingItem }) {
  return (
    <>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-heading truncate">{item.patient}</p>
        <p className="text-xs text-muted">{item.description}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-heading">${item.amount.toLocaleString()}</p>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
          item.status === "paid" ? "bg-emerald-500/10 text-emerald-500" :
          item.status === "pending" ? "bg-amber-500/10 text-amber-500" :
          "bg-red-500/10 text-red-500"
        }`}>
          {item.status}
        </span>
      </div>
    </>
  );
}

export default function ReceptionistDashboardPage() {
  const { user } = useUser();
  const { data, loading, error } = useReceptionistDashboard();

  const firstName = user?.name?.split(" ")[0] ?? "Receptionist";

  const quickActions = useMemo(
    () => [
      { label: "New Patient", icon: FiUserPlus, color: "from-blue-500 to-primary", href: "/dashboard/patients" },
      { label: "Schedule Appointment", icon: FiCalendar, color: "from-teal-500 to-secondary", href: "/dashboard/appointments" },
      { label: "Process Payment", icon: FiDollarSign, color: "from-amber-500 to-accent", href: "/dashboard/billing" },
      { label: "Patient Lookup", icon: FiSearch, color: "from-violet-500 to-purple-500", href: "/dashboard/patients" },
    ],
    []
  );

  const statsData = useMemo(() => [
    {
      label: "In Queue",
      value: data?.queue?.length ?? 0,
      icon: FiList,
      color: "from-blue-500 to-primary",
    },
    {
      label: "Walk-in Today",
      value: data?.newRegistrations?.length ?? 0,
      icon: FiUserPlus,
      color: "from-teal-500 to-secondary",
    },
    {
      label: "Scheduled",
      value: data?.scheduledAppointments?.length ?? 0,
      icon: FiCalendar,
      color: "from-amber-500 to-accent",
    },
    {
      label: "Pending Billing",
      value: data?.pendingBilling?.filter((b) => b.status === "pending" || b.status === "overdue").length ?? 0,
      icon: FiDollarSign,
      color: "from-violet-500 to-purple-500",
    },
  ], [data]);

  return (
    <RoleGuard roles={["receptionist"]}>
      <DashboardLayout>
        <PageContainer
          title="Reception Dashboard"
          subtitle={`Manage appointments, patients, and front desk operations.`}
          breadcrumbs={[{ label: "Dashboard" }]}
        >
          <StaggerContainer className="space-y-6">
            <WelcomeBanner
              name={user?.name ?? "Receptionist"}
              role={(user?.role as UserRole) ?? "receptionist"}
              icon={FiUsers}
              title={`Welcome back, ${firstName}`}
              description="Manage appointments, patient registrations, and front desk operations."
            />

            {error && (
              <div className="rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsData.map((stat) => (
                <StatCard
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  icon={stat.icon}
                  color={stat.color}
                  loading={loading}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DashboardSection
                title="Today's Queue"
                subtitle={loading ? "" : `${data?.queue?.length ?? 0} patients in queue`}
              >
                <DataTable
                  columns={[
                    { key: "info", header: "", render: (item: QueueItem) => <QueueRow item={item} />, className: "flex items-center gap-3 w-full" },
                  ]}
                  data={data?.queue ?? []}
                  loading={loading}
                  keyExtractor={(item) => item.id}
                  emptyTitle="Queue is empty"
                  emptyDescription="No patients are currently waiting."
                />
              </DashboardSection>

              <DashboardSection
                title="Scheduled Appointments"
                subtitle={loading ? "" : `${data?.scheduledAppointments?.length ?? 0} today`}
              >
                <DataTable
                  columns={[
                    { key: "info", header: "", render: (item: AppointmentItem) => <AppointmentRow item={item} />, className: "flex items-center gap-3 w-full" },
                  ]}
                  data={data?.scheduledAppointments ?? []}
                  loading={loading}
                  keyExtractor={(item) => item.id}
                  emptyTitle="No appointments scheduled"
                  emptyDescription="Today's appointments will appear here."
                />
              </DashboardSection>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <DashboardSection
                  title="New Registrations"
                  subtitle={loading ? "" : `${data?.newRegistrations?.length ?? 0} today`}
                >
                  <DataTable
                    columns={[
                      { key: "info", header: "", render: (item: RegistrationItem) => <RegistrationRow item={item} />, className: "flex items-center gap-3 w-full" },
                    ]}
                    data={data?.newRegistrations ?? []}
                    loading={loading}
                    keyExtractor={(item) => item.id}
                    emptyTitle="No new registrations"
                    emptyDescription="New patient registrations will appear here."
                  />
                </DashboardSection>
              </div>

              <div>
                <DashboardSection
                  title="Pending Billing"
                  subtitle={loading ? "" : `${data?.pendingBilling?.filter((b) => b.status === "pending" || b.status === "overdue").length ?? 0} pending`}
                >
                  <DataTable
                    columns={[
                      { key: "info", header: "", render: (item: BillingItem) => <BillingRow item={item} />, className: "flex items-center gap-3 w-full" },
                    ]}
                    data={data?.pendingBilling ?? []}
                    loading={loading}
                    keyExtractor={(item) => item.id}
                    emptyTitle="No pending billing"
                    emptyDescription="All bills are settled."
                  />
                </DashboardSection>
              </div>

              <div>
                <DashboardSection title="Quick Actions">
                  <QuickActionCard actions={quickActions} />
                </DashboardSection>
              </div>
            </div>
          </StaggerContainer>
        </PageContainer>
      </DashboardLayout>
    </RoleGuard>
  );
}
