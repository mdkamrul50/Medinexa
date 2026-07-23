"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiEdit2,
  FiTrash2,
  FiMail,
  FiPhone,
  FiCalendar,
  FiUser,
  FiDroplet,
  FiMaximize,
  FiHeart,
  FiAlertCircle,
  FiPlus,
  FiPhoneCall,
  FiMapPin,
  FiUserCheck,
  FiActivity,
  FiFileText,
} from "react-icons/fi";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PageContainer from "@/components/dashboard/PageContainer";
import RoleGuard from "@/components/auth/RoleGuard";
import DashboardSection from "@/components/dashboard/DashboardSection";
import ConfirmModal from "@/components/dashboard/ConfirmModal";
import StaggerContainer from "@/components/dashboard/StaggerContainer";
import { TableSkeleton } from "@/components/dashboard/Skeleton";
import { usePatient, deletePatient } from "@/hooks/usePatients";
import { useUser } from "@/hooks/useUser";

function InfoRow({
  icon: Icon,
  label,
  value,
  className = "",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/50 text-muted">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-heading mt-0.5">{value || "—"}</p>
      </div>
    </div>
  );
}

export default function PatientDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user, role } = useUser();
  const { patient, loading, error } = usePatient(id);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (role === "patient" && patient && patient.userId !== user?.id) {
      router.replace("/forbidden");
    }
  }, [role, patient, user, router]);

  useEffect(() => {
    if (role === "doctor" && patient && patient.assignedDoctor !== user?.id) {
      router.replace("/forbidden");
    }
  }, [role, patient, user, router]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deletePatient(id);
      router.push("/dashboard/patients");
    } catch {
      /* ignore */
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  if (loading) {
    return (
      <RoleGuard roles={["admin", "doctor", "receptionist", "patient"]}>
        <DashboardLayout>
          <PageContainer title="Patient Details" breadcrumbs={[{ label: "Patients", href: "/dashboard/patients" }, { label: "Loading..." }]}>
            <div className="space-y-6 max-w-4xl">
              <TableSkeleton rows={8} />
            </div>
          </PageContainer>
        </DashboardLayout>
      </RoleGuard>
    );
  }

  if (error || !patient) {
    return (
      <RoleGuard roles={["admin", "doctor", "receptionist", "patient"]}>
        <DashboardLayout>
          <PageContainer title="Patient Not Found" breadcrumbs={[{ label: "Patients", href: "/dashboard/patients" }, { label: "Error" }]}>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 mb-4">
                <FiAlertCircle className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-heading mb-1">Patient not found</h3>
              <p className="text-sm text-body mb-4">The patient you&apos;re looking for doesn&apos;t exist or has been removed.</p>
              <Link
                href="/dashboard/patients"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
              >
                <FiArrowLeft className="h-4 w-4" />
                Back to Patients
              </Link>
            </div>
          </PageContainer>
        </DashboardLayout>
      </RoleGuard>
    );
  }

  const isAdmin = role === "admin";
  const isDoctor = role === "doctor";
  const canEdit = isAdmin || isDoctor;
  const canDelete = isAdmin;

  return (
    <RoleGuard roles={["admin", "doctor", "receptionist", "patient"]}>
      <DashboardLayout>
        <PageContainer
          title="Patient Profile"
          breadcrumbs={[
            { label: "Patients", href: "/dashboard/patients" },
            { label: patient.name },
          ]}
          actions={
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard/patients"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-sm font-semibold text-heading hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <FiArrowLeft className="h-4 w-4" />
                Back
              </Link>
              {canEdit && (
                <Link
                  href={`/dashboard/patients/${id}/edit`}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 px-3.5 py-2 text-sm font-semibold text-white hover:opacity-90 transition-all shadow-sm"
                >
                  <FiEdit2 className="h-4 w-4" />
                  Edit
                </Link>
              )}
              {canDelete && (
                <button
                  onClick={() => setDeleteOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 px-3.5 py-2 text-sm font-semibold text-white hover:opacity-90 transition-all shadow-sm"
                >
                  <FiTrash2 className="h-4 w-4" />
                  Delete
                </button>
              )}
            </div>
          }
        >
          <StaggerContainer className="space-y-6 max-w-4xl">
            <motion.div className="rounded-2xl border border-border bg-card p-6 sm:p-8 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-emerald-500/5" />
              <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white text-2xl font-bold shadow-sm">
                  {patient.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-heading">{patient.name}</h2>
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                        patient.status === "active"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {patient.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted mt-0.5">
                    Patient ID: {patient._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs text-muted mt-1">
                    Registered on {new Date(patient.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DashboardSection title="Personal Information">
                <div className="space-y-4">
                  <InfoRow icon={FiUser} label="Full Name" value={patient.name} />
                  <InfoRow icon={FiMail} label="Email" value={patient.email} />
                  <InfoRow icon={FiPhone} label="Phone" value={patient.phone} />
                  <InfoRow icon={FiCalendar} label="Date of Birth" value={patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"} />
                  <InfoRow icon={FiUser} label="Gender" value={patient.gender} />
                  <InfoRow icon={FiMapPin} label="Address" value={patient.address} />
                </div>
              </DashboardSection>

              <DashboardSection title="Medical Information">
                <div className="space-y-4">
                  <InfoRow icon={FiDroplet} label="Blood Group" value={patient.bloodGroup} />
                  <InfoRow icon={FiMaximize} label="Height" value={patient.height} />
                  <InfoRow icon={FiHeart} label="Weight" value={patient.weight} />
                  <InfoRow icon={FiPhoneCall} label="Emergency Contact" value={patient.emergencyContact} />
                  <InfoRow icon={FiUserCheck} label="Assigned Doctor" value={patient.assignedDoctorName || patient.assignedDoctor || "Unassigned"} />
                </div>
              </DashboardSection>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DashboardSection title="Medical History">
                {patient.medicalHistory ? (
                  <p className="text-sm text-body whitespace-pre-wrap leading-relaxed">{patient.medicalHistory}</p>
                ) : (
                  <p className="text-sm text-muted italic">No medical history recorded</p>
                )}
              </DashboardSection>

              <DashboardSection title="Allergies">
                {patient.allergies ? (
                  <p className="text-sm text-body whitespace-pre-wrap leading-relaxed">{patient.allergies}</p>
                ) : (
                  <p className="text-sm text-muted italic">No allergies recorded</p>
                )}
              </DashboardSection>
            </div>

            <DashboardSection title="Current Medications">
              {patient.currentMedications ? (
                <p className="text-sm text-body whitespace-pre-wrap leading-relaxed">{patient.currentMedications}</p>
              ) : (
                <p className="text-sm text-muted italic">No current medications</p>
              )}
            </DashboardSection>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DashboardSection
                title="Appointments"
                subtitle="Recent appointment history"
                action={
                  <Link
                    href="/dashboard/appointments"
                    className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    View All
                  </Link>
                }
              >
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/50 text-muted mb-3">
                    <FiCalendar className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-medium text-heading mb-1">No appointments yet</p>
                  <p className="text-xs text-muted">Appointments will appear here once scheduled.</p>
                </div>
              </DashboardSection>

              <DashboardSection
                title="Prescriptions"
                subtitle="Active and past prescriptions"
                action={
                  <Link
                    href="/dashboard/prescriptions"
                    className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    View All
                  </Link>
                }
              >
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/50 text-muted mb-3">
                    <FiFileText className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-medium text-heading mb-1">No prescriptions yet</p>
                  <p className="text-xs text-muted">Prescriptions will appear here once issued.</p>
                </div>
              </DashboardSection>
            </div>

            {patient.medicalHistory && (
              <DashboardSection title="Medical History Timeline">
                <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-700 space-y-6 py-2">
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative"
                  >
                    <div className="absolute -left-[26px] top-1 h-3 w-3 rounded-full bg-teal-500 border-2 border-card" />
                    <p className="text-xs font-semibold text-muted">
                      {new Date(patient.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                    <p className="text-sm font-semibold text-heading mt-0.5">Patient Registered</p>
                    <p className="text-xs text-body mt-0.5">Initial patient record created</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative"
                  >
                    <div className="absolute -left-[26px] top-1 h-3 w-3 rounded-full bg-blue-500 border-2 border-card" />
                    <p className="text-xs font-semibold text-muted">
                      {new Date(patient.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                    <p className="text-sm font-semibold text-heading mt-0.5">Medical History Recorded</p>
                    <p className="text-xs text-body mt-0.5">Patient medical history documented</p>
                  </motion.div>
                </div>
              </DashboardSection>
            )}
          </StaggerContainer>
        </PageContainer>

        <ConfirmModal
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={handleDelete}
          title="Delete Patient"
          description={`Are you sure you want to delete ${patient.name}'s record? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
          loading={deleting}
        />
      </DashboardLayout>
    </RoleGuard>
  );
}
