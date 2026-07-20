"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchFromAPI, ApiError } from "@/lib/api-client";

export interface Patient {
  _id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  image?: string;
  gender: string;
  dateOfBirth: string;
  bloodGroup: string;
  height: string;
  weight: string;
  emergencyContact: string;
  address: string;
  assignedDoctor: string;
  medicalHistory: string;
  allergies: string;
  currentMedications: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface PatientsResponse {
  patients: Patient[];
  total: number;
  page: number;
  totalPages: number;
}

export interface UsePatientsParams {
  search?: string;
  bloodGroup?: string;
  status?: string;
  assignedDoctor?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}

export function usePatients(params: UsePatientsParams = {}) {
  const [data, setData] = useState<PatientsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      if (params.search) query.set("search", params.search);
      if (params.bloodGroup) query.set("bloodGroup", params.bloodGroup);
      if (params.status) query.set("status", params.status);
      if (params.assignedDoctor) query.set("assignedDoctor", params.assignedDoctor);
      if (params.sortBy) query.set("sortBy", params.sortBy);
      if (params.sortOrder) query.set("sortOrder", params.sortOrder);
      if (params.page) query.set("page", String(params.page));
      if (params.limit) query.set("limit", String(params.limit));

      const result = await fetchFromAPI<PatientsResponse>(`/api/patients?${query.toString()}`);
      setData(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to fetch patients");
    } finally {
      setLoading(false);
    }
  }, [params.search, params.bloodGroup, params.status, params.assignedDoctor, params.sortBy, params.sortOrder, params.page, params.limit]);

  useEffect(() => { fetchPatients(); }, [fetchPatients]);

  return { data, loading, error, refetch: fetchPatients };
}

export function usePatient(id: string | null) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatient = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFromAPI<Patient>(`/api/patients/${id}`);
      setPatient(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to fetch patient");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchPatient(); }, [fetchPatient]);

  return { patient, loading, error, refetch: fetchPatient };
}

export async function createPatient(data: Record<string, unknown>): Promise<Patient> {
  return fetchFromAPI<Patient>("/api/patients", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updatePatient(id: string, data: Record<string, unknown>): Promise<Patient> {
  return fetchFromAPI<Patient>(`/api/patients/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deletePatient(id: string): Promise<void> {
  await fetchFromAPI<void>(`/api/patients/${id}`, {
    method: "DELETE",
  });
}

export async function fetchPatientByUserId(userId: string): Promise<Patient> {
  return fetchFromAPI<Patient>(`/api/patients/by-user/${userId}`);
}
