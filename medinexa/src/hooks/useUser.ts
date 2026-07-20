import { authClient } from "@/lib/auth-client";
import type { UserRole } from "@/lib/auth-utils";

export function useUser() {
  const { data: session, isPending, error } = authClient.useSession();

  const user = session?.user ?? null;
  const role = (user?.role as UserRole | undefined) ?? null;

  return {
    user,
    session: session?.session ?? null,
    role,
    isPending,
    isAuthenticated: !!session?.user,
    error,
  };
}
