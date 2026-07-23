import { authClient } from "@/lib/auth-client";
import type { AuthSession } from "@/types";
import type { UserRole } from "@/lib/auth-utils";

export function useUser() {
  const { data: session, isPending, error, refetch } = authClient.useSession();

  const sessionData = session as AuthSession | null;
  const user = sessionData?.user ?? null;
  const role = (user?.role as UserRole | undefined) ?? null;

  return {
    user,
    session: sessionData?.session ?? null,
    role,
    isPending,
    isAuthenticated: !!sessionData?.user,
    error,
    refetch,
  };
}
