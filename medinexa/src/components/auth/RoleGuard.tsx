"use client";

import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { useUser } from "@/hooks/useUser";
import { canAccess, type UserRole } from "@/lib/auth-utils";

interface RoleGuardProps {
  children: ReactNode;
  roles?: UserRole[];
  fallback?: ReactNode;
}

export default function RoleGuard({ children, roles, fallback }: RoleGuardProps) {
  const router = useRouter();
  const { user, isPending, isAuthenticated } = useUser();

  useEffect(() => {
    if (isPending) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (roles && user?.role) {
      const hasAccess = roles.includes(user.role as UserRole);
      if (!hasAccess) {
        router.replace("/forbidden");
      }
    }
  }, [isPending, isAuthenticated, user?.role, roles, router]);

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted">Redirecting to login...</p>
      </div>
    );
  }

  if (roles && user?.role && !roles.includes(user.role as UserRole)) {
    return fallback ?? (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted">Redirecting...</p>
      </div>
    );
  }

  return <>{children}</>;
}
