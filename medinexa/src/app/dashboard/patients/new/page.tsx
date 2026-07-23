"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiArrowLeft, FiSave, FiUserPlus } from "react-icons/fi";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PageContainer from "@/components/dashboard/PageContainer";
import RoleGuard from "@/components/auth/RoleGuard";
import DashboardSection from "@/components/dashboard/DashboardSection";
import StaggerContainer from "@/components/dashboard/StaggerContainer";
import { createPatient } from "@/hooks/usePatients";
import { useDoctors, type Doctor } from "@/hooks/useDoctors";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const GENDERS = ["Male", "Female", "Other"];

export default function AddPatientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: doctorsData } = useDoctors({ limit: 100, status: "active" });
  const doctors = doctorsData?.doctors ?? [];
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
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
    status: "active" as const,
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const created = await createPatient({ ...form });
      router.push(`/dashboard/patients/${created._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create patient");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";
  const labelClass = "block text-sm font-semibold text-heading mb-1.5";
  const selectClass = inputClass;

  return (
    <RoleGuard roles={["admin", "receptionist"]}>
      <DashboardLayout>
        <PageContainer
          title="Add Patient"
          subtitle="Register a new patient in the system"
          breadcrumbs={[
            { label: "Patients", href: "/dashboard/patients" },
            { label: "Add Patient" },
          ]}
          actions={
            <Link
              href="/dashboard/patients"
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

              <DashboardSection title="Account Information" subtitle="Login credentials for the patient portal">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="John Doe"
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
                      placeholder="john@example.com"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Temporary Password *</label>
                    <input
                      type="password"
                      required
                      value={form.password}
                      onChange={(e) => update("password", e.target.value)}
                      placeholder="Min 5 chars, 1 letter, 1 number"
                      className={inputClass}
                    />
                  </div>
                </div>
              </DashboardSection>

              <DashboardSection title="Personal Information" subtitle="Demographics and contact details">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      placeholder="Full address"
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
                    <select
                      value={form.assignedDoctor}
                      onChange={(e) => update("assignedDoctor", e.target.value)}
                      className={selectClass}
                    >
                      <option value="">Select a doctor</option>
                      {doctors.map((doc) => (
                        <option key={doc._id} value={doc.userId}>
                          Dr. {doc.name} — {doc.department || "General"}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Medical History</label>
                    <textarea
                      value={form.medicalHistory}
                      onChange={(e) => update("medicalHistory", e.target.value)}
                      placeholder="Previous illnesses, surgeries, chronic conditions..."
                      rows={3}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Allergies</label>
                    <textarea
                      value={form.allergies}
                      onChange={(e) => update("allergies", e.target.value)}
                      placeholder="Drug allergies, food allergies, environmental..."
                      rows={2}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Current Medications</label>
                    <textarea
                      value={form.currentMedications}
                      onChange={(e) => update("currentMedications", e.target.value)}
                      placeholder="Active prescriptions, dosage, frequency..."
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
                  href="/dashboard/patients"
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
                      Creating...
                    </span>
                  ) : (
                    <>
                      <FiSave className="h-4 w-4" />
                      Create Patient
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
