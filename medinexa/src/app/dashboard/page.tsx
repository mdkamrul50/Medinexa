"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiShield } from "react-icons/fi";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PageContainer from "@/components/dashboard/PageContainer";
import { useUser } from "@/hooks/useUser";
import { getDefaultRouteForRole } from "@/lib/auth-utils";
import type { UserRole } from "@/lib/auth-utils";

export default function DashboardPage() {
  const router = useRouter();
  const { role, isPending, isAuthenticated } = useUser();

  useEffect(() => {
    if (isPending) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (role) {
      router.replace(getDefaultRouteForRole(role as UserRole));
    }
  }, [isPending, isAuthenticated, role, router]);

  if (isPending) {
    return (
      <DashboardLayout>
        <PageContainer title="Dashboard" breadcrumbs={[{ label: "Dashboard" }]}>
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-sm text-muted">Loading your dashboard...</p>
            </div>
          </div>
        </PageContainer>
      </DashboardLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <DashboardLayout>
        <PageContainer title="Dashboard" breadcrumbs={[{ label: "Dashboard" }]}>
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FiShield className="h-12 w-12 text-muted mb-4" />
            <h2 className="text-xl font-bold text-heading mb-2">Not signed in</h2>
            <p className="text-body mb-6">Please sign in to view your dashboard.</p>
            <a href="/login" className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-white font-semibold hover:bg-primary/90 transition-colors">Sign In</a>
          </div>
        </PageContainer>
      </DashboardLayout>
    );
  }

  return null;
}
