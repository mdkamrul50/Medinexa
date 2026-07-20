import { authClient } from "@/lib/auth-client";
import type { UserRole } from "@/lib/auth-utils";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export function useUser() {
  const { data: session, isPending, error, refetch } = authClient.useSession();

  const user = (session?.user as AuthUser | undefined) ?? null;
  const role = (user?.role as UserRole | undefined) ?? null;

  return {
    user,
    session: session?.session ?? null,
    role,
    isPending,
    isAuthenticated: !!session?.user,
    error,
    refetch,
  };
}
