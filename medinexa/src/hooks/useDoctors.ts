"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchFromAPI, ApiError } from "@/lib/api-client";

export interface Doctor {
  _id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  image?: string;
  gender: string;
  dateOfBirth: string;
  department: string;
  specialization: string;
  qualifications: string;
  experience: number;
  consultationFee: number;
  availableDays: string[];
  availableTime: string;
  hospitalBranch: string;
  biography: string;
  status: "active" | "inactive";
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorsResponse {
  doctors: Doctor[];
  total: number;
  page: number;
  totalPages: number;
}

export interface UseDoctorsParams {
  search?: string;
  department?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}

export function useDoctors(params: UseDoctorsParams = {}) {
  const [data, setData] = useState<DoctorsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      if (params.search) query.set("search", params.search);
      if (params.department) query.set("department", params.department);
      if (params.status) query.set("status", params.status);
      if (params.sortBy) query.set("sortBy", params.sortBy);
      if (params.sortOrder) query.set("sortOrder", params.sortOrder);
      if (params.page) query.set("page", String(params.page));
      if (params.limit) query.set("limit", String(params.limit));

      const result = await fetchFromAPI<DoctorsResponse>(`/api/doctors?${query.toString()}`);
      setData(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  }, [params.search, params.department, params.status, params.sortBy, params.sortOrder, params.page, params.limit]);

  useEffect(() => { fetchDoctors(); }, [fetchDoctors]);

  return { data, loading, error, refetch: fetchDoctors };
}

export function useDoctor(id: string | null) {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctor = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFromAPI<Doctor>(`/api/doctors/${id}`);
      setDoctor(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to fetch doctor");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchDoctor(); }, [fetchDoctor]);

  return { doctor, loading, error, refetch: fetchDoctor };
}

export async function createDoctor(data: Record<string, unknown>): Promise<Doctor> {
  return fetchFromAPI<Doctor>("/api/doctors", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateDoctor(id: string, data: Record<string, unknown>): Promise<Doctor> {
  return fetchFromAPI<Doctor>(`/api/doctors/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteDoctor(id: string): Promise<void> {
  await fetchFromAPI<void>(`/api/doctors/${id}`, {
    method: "DELETE",
  });
}
