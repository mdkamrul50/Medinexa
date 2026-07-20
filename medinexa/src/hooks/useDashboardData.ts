import { useState, useEffect, useCallback } from "react";
import { fetchFromAPI, ApiError } from "@/lib/api-client";
import type { UserRole } from "@/lib/auth-utils";

export interface DashboardStats {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  trend?: { value: string; positive: boolean };
}

export interface AppointmentItem {
  id: string;
  patient: string;
  doctor?: string;
  department?: string;
  type?: string;
  time: string;
  date?: string;
  status: "scheduled" | "checked-in" | "completed" | "cancelled";
}

export interface ActivityItem {
  id: string;
  action: string;
  description?: string;
  time: string;
  type?: string;
}

export interface RegistrationItem {
  id: string;
  name: string;
  email: string;
  role: string;
  date: string;
}

export interface PatientVisit {
  id: string;
  name: string;
  condition?: string;
  date: string;
  status?: string;
}

export interface QuickAction {
  label: string;
  description?: string;
  href?: string;
  color: string;
}

export interface PrescriptionItem {
  id: string;
  medication: string;
  dosage: string;
  prescribedBy?: string;
  date: string;
  status: "active" | "completed" | "expired";
}

export interface PaymentItem {
  id: string;
  description: string;
  amount: number;
  date: string;
  status: "paid" | "pending" | "overdue";
}

export interface MedicalReport {
  id: string;
  title: string;
  doctor?: string;
  date: string;
  type: string;
}

export interface BillingItem {
  id: string;
  patient: string;
  description: string;
  amount: number;
  date: string;
  status: "paid" | "pending" | "overdue";
}

export interface QueueItem {
  id: string;
  patient: string;
  token: number;
  doctor: string;
  department: string;
  status: "waiting" | "with-doctor" | "completed";
}

export interface AdminDashboardData {
  stats: DashboardStats[];
  todayAppointments: AppointmentItem[];
  recentRegistrations: RegistrationItem[];
  recentActivities: ActivityItem[];
}

export interface DoctorDashboardData {
  stats: DashboardStats[];
  todaySchedule: AppointmentItem[];
  upcomingAppointments: AppointmentItem[];
  recentPatients: PatientVisit[];
}

export interface PatientDashboardData {
  upcomingAppointment: AppointmentItem | null;
  appointmentHistory: AppointmentItem[];
  activePrescriptions: PrescriptionItem[];
  medicalReports: MedicalReport[];
  payments: PaymentItem[];
}

export interface ReceptionistDashboardData {
  queue: QueueItem[];
  scheduledAppointments: AppointmentItem[];
  newRegistrations: RegistrationItem[];
  pendingBilling: BillingItem[];
}

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function useFetch<T>(endpoint: string | null): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  const refetch = useCallback(() => setTrigger((n) => n + 1), []);

  useEffect(() => {
    if (!endpoint) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchFromAPI<T>(endpoint)
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          if (err instanceof ApiError && err.status === 404) {
            setData(null);
          } else {
            setError(err.message ?? "Failed to fetch data");
          }
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, trigger]);

  return { data, loading, error, refetch };
}

export function useAdminDashboard() {
  return useFetch<AdminDashboardData>("/api/dashboard/admin");
}

export function useDoctorDashboard() {
  return useFetch<DoctorDashboardData>("/api/dashboard/doctor");
}

export function usePatientDashboard() {
  return useFetch<PatientDashboardData>("/api/dashboard/patient");
}

export function useReceptionistDashboard() {
  return useFetch<ReceptionistDashboardData>("/api/dashboard/receptionist");
}
