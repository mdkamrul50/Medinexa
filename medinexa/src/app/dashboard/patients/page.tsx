"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiEye, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PageContainer from "@/components/dashboard/PageContainer";
import RoleGuard from "@/components/auth/RoleGuard";
import DashboardSection from "@/components/dashboard/DashboardSection";
import DataTable from "@/components/dashboard/DataTable";
import StaggerContainer from "@/components/dashboard/StaggerContainer";
import ConfirmModal from "@/components/dashboard/ConfirmModal";
import { usePatients, deletePatient, type Patient } from "@/hooks/usePatients";
import { useUser } from "@/hooks/useUser";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const STATUSES = ["active", "inactive"];

const statusColor: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-500",
  inactive: "bg-red-500/10 text-red-500",
};

function PatientRow({
  item,
  onDelete,
  role,
}: {
  item: Patient;
  onDelete: (id: string) => void;
  role: string;
}) {
  const canEdit = role === "admin" || role === "doctor" || role === "receptionist";
  const canDelete = role === "admin";

  return (
    <>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white text-sm font-bold">
          {item.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-heading truncate">{item.name}</p>
          <p className="text-xs text-muted truncate">{item.email}</p>
        </div>
      </div>
      <div className="hidden sm:block">
        <p className="text-sm font-medium text-heading">{item.bloodGroup || "—"}</p>
        <p className="text-xs text-muted">{item.gender}</p>
      </div>
      <div className="hidden md:block text-sm text-muted max-w-[120px] truncate">
        {item.assignedDoctorName || "Unassigned"}
      </div>
      <div className="hidden lg:block text-sm text-muted">
        {item.phone}
      </div>
      <span
        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
          statusColor[item.status] ?? ""
        }`}
      >
        {item.status}
      </span>
      <div className="flex items-center gap-1">
        <Link
          href={`/dashboard/patients/${item._id}`}
          className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="View"
        >
          <FiEye className="h-4 w-4" />
        </Link>
        {canEdit && (
          <Link
            href={`/dashboard/patients/${item._id}/edit`}
            className="p-1.5 rounded-lg text-muted hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Edit"
          >
            <FiEdit2 className="h-4 w-4" />
          </Link>
        )}
        {canDelete && (
          <button
            onClick={() => onDelete(item._id)}
            className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Delete"
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </>
  );
}

export default function PatientsListPage() {
  const { role } = useUser();
  const [search, setSearch] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [status, setStatus] = useState("");
  const [assignedDoctor] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const params = useMemo(
    () => ({
      search: search || undefined,
      bloodGroup: bloodGroup || undefined,
      status: status || undefined,
      assignedDoctor: assignedDoctor || undefined,
      sortBy,
      sortOrder,
      page,
      limit: 10,
    }),
    [search, bloodGroup, status, assignedDoctor, sortBy, sortOrder, page]
  );

  const { data, loading, refetch } = usePatients(params);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deletePatient(deleteId);
      setDeleteId(null);
      refetch();
    } catch {
      /* ignore */
    } finally {
      setDeleting(false);
    }
  };

  const canAdd =
    role === "admin" ||
    role === "receptionist";

  return (
    <RoleGuard roles={["admin", "doctor", "receptionist"]}>
      <DashboardLayout>
        <PageContainer
          title="Patients"
          subtitle="Manage patient records and medical information"
          breadcrumbs={[{ label: "Patients" }]}
          actions={
            canAdd ? (
              <Link
                href="/dashboard/patients/new"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-all shadow-sm"
              >
                <FiPlus className="h-4 w-4" />
                Add Patient
              </Link>
            ) : undefined
          }
        >
          <StaggerContainer className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-xl border border-border bg-card pl-9 pr-4 py-2 text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <select
                value={bloodGroup}
                onChange={(e) => {
                  setBloodGroup(e.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-heading focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="">All Blood Groups</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-heading focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="">All Status</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="capitalize">
                    {s}
                  </option>
                ))}
              </select>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [b, o] = e.target.value.split("-");
                  setSortBy(b);
                  setSortOrder(o);
                }}
                className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-heading focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="createdAt-desc">Newest</option>
                <option value="createdAt-asc">Oldest</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
              </select>
            </div>

            <DashboardSection
              title={`All Patients${data ? ` (${data.total})` : ""}`}
            >
              <DataTable
                columns={[
                  {
                    key: "info",
                    header: "",
                    render: (item: Patient) => (
                      <PatientRow
                        item={item}
                        onDelete={setDeleteId}
                        role={role ?? "patient"}
                      />
                    ),
                    className: "flex items-center gap-3 w-full",
                  },
                ]}
                data={data?.patients ?? []}
                loading={loading}
                keyExtractor={(item) => item._id}
                emptyTitle="No patients found"
                emptyDescription={
                  search || bloodGroup || status
                    ? "Try adjusting your filters."
                    : "Register your first patient to get started."
                }
              />
            </DashboardSection>

            {data && data.totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted">
                  Page {data.page} of {data.totalPages} ({data.total} total)
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="p-2 rounded-lg border border-border bg-card text-muted hover:text-heading disabled:opacity-30 transition-colors"
                  >
                    <FiChevronLeft className="h-4 w-4" />
                  </button>
                  {Array.from({ length: data.totalPages }, (_, i) => i + 1)
                    .filter(
                      (p) =>
                        p === 1 ||
                        p === data.totalPages ||
                        Math.abs(p - data.page) <= 1
                    )
                    .map((p, idx, arr) => (
                      <span key={p} className="flex items-center">
                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                          <span className="px-1 text-muted">...</span>
                        )}
                        <button
                          onClick={() => setPage(p)}
                          className={`min-w-[32px] h-8 rounded-lg text-xs font-semibold transition-colors ${
                            p === page
                              ? "bg-primary text-white"
                              : "border border-border bg-card text-muted hover:text-heading"
                          }`}
                        >
                          {p}
                        </button>
                      </span>
                    ))}
                  <button
                    onClick={() =>
                      setPage((p) => Math.min(data.totalPages, p + 1))
                    }
                    disabled={page >= data.totalPages}
                    className="p-2 rounded-lg border border-border bg-card text-muted hover:text-heading disabled:opacity-30 transition-colors"
                  >
                    <FiChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </StaggerContainer>
        </PageContainer>

        <ConfirmModal
          open={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          title="Delete Patient"
          description="Are you sure you want to delete this patient record? This action cannot be undone."
          confirmLabel="Delete"
          variant="danger"
          loading={deleting}
        />
      </DashboardLayout>
    </RoleGuard>
  );
}
