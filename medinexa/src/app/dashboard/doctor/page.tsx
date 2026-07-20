"use client";

import { useMemo } from "react";
import {
  FiUsers,
  FiCalendar,
  FiFileText,
  FiClock,
  FiUserCheck,
  FiPlusCircle,
  FiSearch,
  FiMessageSquare,
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
import { useDoctorDashboard } from "@/hooks/useDashboardData";
import type { AppointmentItem, PatientVisit, DashboardStats } from "@/hooks/useDashboardData";
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
        {item.status === "checked-in" ? "Checked In" : item.status}
      </span>
    </>
  );
}

function PatientRow({ item }: { item: PatientVisit }) {
  return (
    <>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-heading truncate">{item.name}</p>
        {item.condition && (
          <p className="text-xs text-muted">{item.condition}</p>
        )}
      </div>
      <span className="text-xs text-muted">{item.date}</span>
      {item.status && (
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
          item.status === "completed" ? "bg-emerald-500/10 text-emerald-500" :
          item.status === "in-progress" ? "bg-amber-500/10 text-amber-500" :
          "bg-blue-500/10 text-blue-500"
        }`}>
          {item.status}
        </span>
      )}
    </>
  );
}

export default function DoctorDashboardPage() {
  const { user } = useUser();
  const { data, loading } = useDoctorDashboard();

  const firstName = user?.name?.split(" ")[0] ?? "Doctor";

  const quickActions = useMemo(
    () => [
      { label: "New Prescription", icon: FiPlusCircle, color: "from-blue-500 to-primary", href: "/dashboard/prescriptions" },
      { label: "View Schedule", icon: FiCalendar, color: "from-teal-500 to-secondary", href: "/dashboard/schedule" },
      { label: "Patient Lookup", icon: FiSearch, color: "from-amber-500 to-accent", href: "/dashboard/patients" },
      { label: "Messages", icon: FiMessageSquare, color: "from-violet-500 to-purple-500", href: "/dashboard/messages" },
    ],
    []
  );

  const statCards: { label: string; icon: IconType; color: string; suffix?: string }[] = [
    { label: "My Patients", icon: FiUsers, color: "from-blue-500 to-primary" },
    { label: "Today's Appointments", icon: FiCalendar, color: "from-teal-500 to-secondary" },
    { label: "Pending Prescriptions", icon: FiFileText, color: "from-amber-500 to-accent" },
    { label: "Next Appointment", icon: FiClock, color: "from-violet-500 to-purple-500", suffix: "" },
  ];

  return (
    <RoleGuard roles={["doctor"]}>
      <DashboardLayout>
        <PageContainer
          title="Doctor Dashboard"
          subtitle={`Your patients and schedule at a glance.`}
          breadcrumbs={[{ label: "Dashboard" }]}
        >
          <StaggerContainer className="space-y-6">
            <WelcomeBanner
              name={user?.name ?? "Doctor"}
              role={(user?.role as UserRole) ?? "doctor"}
              icon={FiUserCheck}
              title={`Welcome back, Dr. ${firstName}`}
              description="Manage your patients, appointments, and prescriptions."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((card) => {
                const stat = data?.stats?.find((s) => s.label === card.label);
                const displayValue = card.label === "Next Appointment" && !stat?.value
                  ? "N/A"
                  : (stat?.value ?? 0);
                return (
                  <StatCard
                    key={card.label}
                    label={card.label}
                    value={displayValue}
                    icon={card.icon}
                    color={card.color}
                    loading={loading}
                    trend={stat?.trend}
                    suffix={stat?.suffix ?? card.suffix}
                  />
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DashboardSection
                title="Today's Schedule"
                subtitle={loading ? "" : `${data?.todaySchedule?.length ?? 0} appointments today`}
              >
                <DataTable
                  columns={[
                    { key: "info", header: "", render: (item: AppointmentItem) => <AppointmentRow item={item} />, className: "flex items-center gap-3 w-full" },
                  ]}
                  data={data?.todaySchedule ?? []}
                  loading={loading}
                  keyExtractor={(item) => item.id}
                  emptyTitle="No appointments today"
                  emptyDescription="Your schedule is clear for today."
                />
              </DashboardSection>

              <DashboardSection
                title="Upcoming Appointments"
                subtitle={loading ? "" : `${data?.upcomingAppointments?.length ?? 0} upcoming`}
              >
                <DataTable
                  columns={[
                    { key: "info", header: "", render: (item: AppointmentItem) => <AppointmentRow item={item} />, className: "flex items-center gap-3 w-full" },
                  ]}
                  data={data?.upcomingAppointments ?? []}
                  loading={loading}
                  keyExtractor={(item) => item.id}
                  emptyTitle="No upcoming appointments"
                  emptyDescription="Future appointments will appear here."
                />
              </DashboardSection>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <DashboardSection
                  title="Recent Patient Visits"
                  subtitle={loading ? "" : `${data?.recentPatients?.length ?? 0} recent visits`}
                >
                  <DataTable
                    columns={[
                      { key: "info", header: "", render: (item: PatientVisit) => <PatientRow item={item} />, className: "flex items-center gap-3 w-full" },
                    ]}
                    data={data?.recentPatients ?? []}
                    loading={loading}
                    keyExtractor={(item) => item.id}
                    emptyTitle="No recent patient visits"
                    emptyDescription="Patient visit history will appear here."
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
