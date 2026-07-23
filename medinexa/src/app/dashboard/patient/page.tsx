"use client";

import { useMemo } from "react";
import {
  FiCalendar,
  FiFileText,
  FiClock,
  FiUser,
  FiDollarSign,
  FiPlusCircle,
  FiSearch,
  FiMessageSquare,
  FiHeart,
} from "react-icons/fi";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PageContainer from "@/components/dashboard/PageContainer";
import RoleGuard from "@/components/auth/RoleGuard";
import StatCard from "@/components/dashboard/StatCard";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import DashboardSection from "@/components/dashboard/DashboardSection";
import DataTable from "@/components/dashboard/DataTable";
import QuickActionCard from "@/components/dashboard/QuickActionCard";
import EmptyState from "@/components/dashboard/EmptyState";
import StaggerContainer from "@/components/dashboard/StaggerContainer";
import { useUser } from "@/hooks/useUser";
import { usePatientDashboard } from "@/hooks/useDashboardData";
import type { AppointmentItem, PrescriptionItem, MedicalReport, PaymentItem } from "@/hooks/useDashboardData";
import type { UserRole } from "@/lib/auth-utils";

function AppointmentRow({ item }: { item: AppointmentItem }) {
  return (
    <>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-heading truncate">
          {item.doctor ?? item.patient}
        </p>
        <p className="text-xs text-muted">{item.department ?? item.type}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-primary">{item.date ?? item.time}</p>
        {item.time && <p className="text-xs text-muted">{item.time}</p>}
      </div>
    </>
  );
}

function PrescriptionRow({ item }: { item: PrescriptionItem }) {
  return (
    <>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-heading truncate">{item.medication}</p>
        <p className="text-xs text-muted">{item.dosage}{item.prescribedBy ? ` • ${item.prescribedBy}` : ""}</p>
      </div>
      <div className="text-right">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
          item.status === "active" ? "bg-emerald-500/10 text-emerald-500" :
          item.status === "completed" ? "bg-blue-500/10 text-blue-500" :
          "bg-red-500/10 text-red-500"
        }`}>
          {item.status}
        </span>
        <p className="text-[10px] text-muted mt-0.5">{item.date}</p>
      </div>
    </>
  );
}

function ReportRow({ item }: { item: MedicalReport }) {
  return (
    <>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-heading truncate">{item.title}</p>
        <p className="text-xs text-muted">{item.type}{item.doctor ? ` • ${item.doctor}` : ""}</p>
      </div>
      <span className="text-xs text-muted">{item.date}</span>
    </>
  );
}

function PaymentRow({ item }: { item: PaymentItem }) {
  return (
    <>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-heading truncate">{item.description}</p>
        <p className="text-xs text-muted">{item.date}</p>
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

export default function PatientDashboardPage() {
  const { user } = useUser();
  const { data, loading, error } = usePatientDashboard();

  const firstName = user?.name?.split(" ")[0] ?? "Patient";

  const quickActions = useMemo(
    () => [
      { label: "Book Appointment", icon: FiPlusCircle, color: "from-blue-500 to-primary", href: "/dashboard/appointments" },
      { label: "Find Doctor", icon: FiSearch, color: "from-teal-500 to-secondary", href: "/dashboard/doctors" },
      { label: "Messages", icon: FiMessageSquare, color: "from-amber-500 to-accent", href: "/dashboard/messages" },
      { label: "Health Resources", icon: FiHeart, color: "from-violet-500 to-purple-500", href: "/dashboard/resources" },
    ],
    []
  );

  return (
    <RoleGuard roles={["patient"]}>
      <DashboardLayout>
        <PageContainer
          title="My Dashboard"
          subtitle={`Your healthcare at a glance.`}
          breadcrumbs={[{ label: "Dashboard" }]}
        >
          <StaggerContainer className="space-y-6">
            <WelcomeBanner
              name={user?.name ?? "Patient"}
              role={(user?.role as UserRole) ?? "patient"}
              icon={FiUser}
              title={`Welcome back, ${firstName}`}
              description="Manage your appointments, medical records, and prescriptions."
            />

            {error && (
              <div className="rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                label="Next Appointment"
                value={data?.upcomingAppointment ? data.upcomingAppointment.date ?? "N/A" : "N/A"}
                icon={FiCalendar}
                color="from-blue-500 to-primary"
                loading={loading}
              />
              <StatCard
                label="Total Visits"
                value={data?.appointmentHistory?.length ?? 0}
                icon={FiClock}
                color="from-teal-500 to-secondary"
                loading={loading}
              />
              <StatCard
                label="Active Prescriptions"
                value={data?.activePrescriptions?.filter((p) => p.status === "active").length ?? 0}
                icon={FiFileText}
                color="from-amber-500 to-accent"
                loading={loading}
              />
              <StatCard
                label="Pending Payments"
                value={data?.payments?.filter((p) => p.status === "pending" || p.status === "overdue").length ?? 0}
                icon={FiDollarSign}
                color="from-violet-500 to-purple-500"
                loading={loading}
              />
            </div>

            {data?.upcomingAppointment && (
              <DashboardSection
                title="Upcoming Appointment"
                subtitle="Your next scheduled visit"
              >
                <div className="flex items-center gap-4 rounded-xl bg-primary/5 border border-primary/10 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FiCalendar className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-heading">
                      {data.upcomingAppointment.doctor ?? data.upcomingAppointment.patient}
                    </p>
                    <p className="text-xs text-muted">
                      {data.upcomingAppointment.department ?? data.upcomingAppointment.type}
                    </p>
                    <p className="text-xs font-medium text-primary mt-0.5">
                      {data.upcomingAppointment.date} at {data.upcomingAppointment.time}
                    </p>
                  </div>
                </div>
              </DashboardSection>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DashboardSection
                title="Appointment History"
                subtitle={loading ? "" : `${data?.appointmentHistory?.length ?? 0} total visits`}
              >
                <DataTable
                  columns={[
                    { key: "info", header: "", render: (item: AppointmentItem) => <AppointmentRow item={item} />, className: "flex items-center gap-3 w-full" },
                  ]}
                  data={data?.appointmentHistory ?? []}
                  loading={loading}
                  keyExtractor={(item) => item.id}
                  emptyTitle="No appointment history"
                  emptyDescription="Your past appointments will appear here."
                />
              </DashboardSection>

              <DashboardSection
                title="Active Prescriptions"
                subtitle={loading ? "" : `${data?.activePrescriptions?.length ?? 0} prescriptions`}
              >
                <DataTable
                  columns={[
                    { key: "info", header: "", render: (item: PrescriptionItem) => <PrescriptionRow item={item} />, className: "flex items-center gap-3 w-full" },
                  ]}
                  data={data?.activePrescriptions ?? []}
                  loading={loading}
                  keyExtractor={(item) => item.id}
                  emptyTitle="No active prescriptions"
                  emptyDescription="Prescribed medications will appear here."
                />
              </DashboardSection>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <DashboardSection
                  title="Medical Reports"
                  subtitle={loading ? "" : `${data?.medicalReports?.length ?? 0} reports`}
                >
                  <DataTable
                    columns={[
                      { key: "info", header: "", render: (item: MedicalReport) => <ReportRow item={item} />, className: "flex items-center gap-3 w-full" },
                    ]}
                    data={data?.medicalReports ?? []}
                    loading={loading}
                    keyExtractor={(item) => item.id}
                    emptyTitle="No medical reports"
                    emptyDescription="Lab results and reports will appear here."
                  />
                </DashboardSection>
              </div>
              <div className="space-y-6">
                <DashboardSection title="Payment Status">
                  {loading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-12 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700/60" />
                      ))}
                    </div>
                  ) : !data?.payments || data.payments.length === 0 ? (
                    <EmptyState
                      title="No payment records"
                      description="Your billing history will appear here."
                    />
                  ) : (
                    <DataTable
                      columns={[
                        { key: "info", header: "", render: (item: PaymentItem) => <PaymentRow item={item} />, className: "flex items-center gap-3 w-full" },
                      ]}
                      data={data.payments}
                      loading={false}
                      keyExtractor={(item) => item.id}
                    />
                  )}
                </DashboardSection>

                <DashboardSection title="Personal Information">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <FiUser className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-heading">{user?.name}</p>
                        <p className="text-xs text-muted">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                </DashboardSection>

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
