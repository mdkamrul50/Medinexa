"use client";

import { useState, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { fetchFromAPI } from "@/lib/api-client";

interface ProfileData {
  name: string;
  phone: string;
  address: string;
}

interface UpdateState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function useProfileUpdate(onProfileUpdated?: () => void) {
  const [profileState, setProfileState] = useState<UpdateState>({
    loading: false,
    error: null,
    success: false,
  });

  const [passwordState, setPasswordState] = useState<UpdateState>({
    loading: false,
    error: null,
    success: false,
  });

  const updateProfile = useCallback(async (data: ProfileData) => {
    setProfileState({ loading: true, error: null, success: false });

    try {
      await fetchFromAPI("/api/users/profile", {
        method: "PATCH",
        body: JSON.stringify(data),
      });

      setProfileState({ loading: false, error: null, success: true });
      onProfileUpdated?.();

      setTimeout(() => {
        setProfileState((prev) => ({ ...prev, success: false }));
      }, 3000);
    } catch (err) {
      setProfileState({
        loading: false,
        error: err instanceof Error ? err.message : "Failed to update profile",
        success: false,
      });
    }
  }, [onProfileUpdated]);

  const changePassword = useCallback(async (data: PasswordData) => {
    setPasswordState({ loading: true, error: null, success: false });

    if (data.newPassword !== data.confirmPassword) {
      setPasswordState({
        loading: false,
        error: "Passwords do not match",
        success: false,
      });
      return;
    }

    if (data.newPassword.length < 5) {
      setPasswordState({
        loading: false,
        error: "Password must be at least 5 characters",
        success: false,
      });
      return;
    }

    try {
      const { error: changeError } = await authClient.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (changeError) {
        setPasswordState({
          loading: false,
          error: changeError.message || changeError.statusText || "Failed to change password",
          success: false,
        });
        return;
      }

      setPasswordState({ loading: false, error: null, success: true });

      setTimeout(() => {
        setPasswordState((prev) => ({ ...prev, success: false }));
      }, 3000);
    } catch {
      setPasswordState({
        loading: false,
        error: "Failed to change password",
        success: false,
      });
    }
  }, []);

  const clearProfileError = useCallback(() => {
    setProfileState((prev) => ({ ...prev, error: null }));
  }, []);

  const clearPasswordError = useCallback(() => {
    setPasswordState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    profileState,
    passwordState,
    updateProfile,
    changePassword,
    clearProfileError,
    clearPasswordError,
  };
}
