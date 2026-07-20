"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PageContainer from "@/components/dashboard/PageContainer";
import RoleGuard from "@/components/auth/RoleGuard";
import DashboardSection from "@/components/dashboard/DashboardSection";
import StaggerContainer from "@/components/dashboard/StaggerContainer";
import { TableSkeleton } from "@/components/dashboard/Skeleton";
import { usePatient, updatePatient } from "@/hooks/usePatients";
import { useUser } from "@/hooks/useUser";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const GENDERS = ["Male", "Female", "Other"];

export default function EditPatientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user, role } = useUser();
  const { patient, loading: fetching } = usePatient(id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    bloodGroup: "",
    height: "",
    weight: "",
    emergencyContact: "",
    address: "",
    assignedDoctor: "",
    medicalHistory: "",
    allergies: "",
    currentMedications: "",
    status: "active" as "active" | "inactive",
  });

  useEffect(() => {
    if (role === "doctor" && patient && patient.assignedDoctor !== user?.name && patient.assignedDoctor !== user?.id) {
      router.replace("/forbidden");
    }
  }, [role, patient, user, router]);

  useEffect(() => {
    if (patient) {
      setForm({
        name: patient.name || "",
        email: patient.email || "",
        phone: patient.phone || "",
        gender: patient.gender || "",
        dateOfBirth: patient.dateOfBirth || "",
        bloodGroup: patient.bloodGroup || "",
        height: patient.height || "",
        weight: patient.weight || "",
        emergencyContact: patient.emergencyContact || "",
        address: patient.address || "",
        assignedDoctor: patient.assignedDoctor || "",
        medicalHistory: patient.medicalHistory || "",
        allergies: patient.allergies || "",
        currentMedications: patient.currentMedications || "",
        status: patient.status || "active",
      });
    }
  }, [patient]);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updatePatient(id, { ...form });
      router.push(`/dashboard/patients/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update patient");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";
  const labelClass = "block text-sm font-semibold text-heading mb-1.5";
  const selectClass = inputClass;

  if (fetching) {
    return (
      <RoleGuard roles={["admin", "doctor"]}>
        <DashboardLayout>
          <PageContainer title="Edit Patient" breadcrumbs={[{ label: "Patients", href: "/dashboard/patients" }, { label: "Edit" }]}>
            <div className="space-y-6 max-w-4xl">
              <TableSkeleton rows={8} />
            </div>
          </PageContainer>
        </DashboardLayout>
      </RoleGuard>
    );
  }

  if (!patient) {
    return (
      <RoleGuard roles={["admin", "doctor"]}>
        <DashboardLayout>
          <PageContainer title="Patient Not Found" breadcrumbs={[{ label: "Patients", href: "/dashboard/patients" }, { label: "Edit" }]}>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <h3 className="text-base font-bold text-heading">Patient not found</h3>
              <Link href="/dashboard/patients" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white">
                <FiArrowLeft className="h-4 w-4" />
                Back to Patients
              </Link>
            </div>
          </PageContainer>
        </DashboardLayout>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard roles={["admin", "doctor"]}>
      <DashboardLayout>
        <PageContainer
          title="Edit Patient"
          subtitle={`Updating ${patient.name}'s information`}
          breadcrumbs={[
            { label: "Patients", href: "/dashboard/patients" },
            { label: patient.name, href: `/dashboard/patients/${id}` },
            { label: "Edit" },
          ]}
          actions={
            <Link
              href={`/dashboard/patients/${id}`}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-heading hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <FiArrowLeft className="h-4 w-4" />
              Back
            </Link>
          }
        >
          <form onSubmit={handleSubmit}>
            <StaggerContainer className="space-y-6 max-w-4xl">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-600 dark:text-red-400"
                >
                  {error}
                </motion.div>
              )}

              <DashboardSection title="Personal Information" subtitle="Demographics and contact details">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Gender</label>
                    <select
                      value={form.gender}
                      onChange={(e) => update("gender", e.target.value)}
                      className={selectClass}
                    >
                      <option value="">Select gender</option>
                      {GENDERS.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Date of Birth</label>
                    <input
                      type="date"
                      value={form.dateOfBirth}
                      onChange={(e) => update("dateOfBirth", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Blood Group</label>
                    <select
                      value={form.bloodGroup}
                      onChange={(e) => update("bloodGroup", e.target.value)}
                      className={selectClass}
                    >
                      <option value="">Select blood group</option>
                      {BLOOD_GROUPS.map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Height</label>
                    <input
                      type="text"
                      value={form.height}
                      onChange={(e) => update("height", e.target.value)}
                      placeholder="e.g. 5'10&quot; or 178 cm"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Weight</label>
                    <input
                      type="text"
                      value={form.weight}
                      onChange={(e) => update("weight", e.target.value)}
                      placeholder="e.g. 75 kg"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Emergency Contact</label>
                    <input
                      type="text"
                      value={form.emergencyContact}
                      onChange={(e) => update("emergencyContact", e.target.value)}
                      placeholder="Name and phone"
                      className={inputClass}
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className={labelClass}>Address</label>
                    <textarea
                      value={form.address}
                      onChange={(e) => update("address", e.target.value)}
                      rows={2}
                      className={inputClass}
                    />
                  </div>
                </div>
              </DashboardSection>

              <DashboardSection title="Medical Information" subtitle="Health records and clinical data">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className={labelClass}>Assigned Doctor</label>
                    <input
                      type="text"
                      value={form.assignedDoctor}
                      onChange={(e) => update("assignedDoctor", e.target.value)}
                      placeholder="Doctor's name"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Medical History</label>
                    <textarea
                      value={form.medicalHistory}
                      onChange={(e) => update("medicalHistory", e.target.value)}
                      rows={3}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Allergies</label>
                    <textarea
                      value={form.allergies}
                      onChange={(e) => update("allergies", e.target.value)}
                      rows={2}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Current Medications</label>
                    <textarea
                      value={form.currentMedications}
                      onChange={(e) => update("currentMedications", e.target.value)}
                      rows={2}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => update("status", e.target.value)}
                      className={selectClass}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </DashboardSection>

              <div className="flex items-center justify-end gap-3 pb-8">
                <Link
                  href={`/dashboard/patients/${id}`}
                  className="px-5 py-2.5 rounded-xl border border-border bg-card text-sm font-semibold text-heading hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-all shadow-sm disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Saving...
                    </span>
                  ) : (
                    <>
                      <FiSave className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </StaggerContainer>
          </form>
        </PageContainer>
      </DashboardLayout>
    </RoleGuard>
  );
}
