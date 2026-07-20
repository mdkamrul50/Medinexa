export type UserRole = "admin" | "doctor" | "patient" | "receptionist";

const ROUTE_ROLE_MAP: Record<string, UserRole[]> = {
  "/dashboard": ["admin", "doctor", "patient", "receptionist"],
  "/dashboard/admin": ["admin"],
  "/dashboard/doctor": ["doctor"],
  "/dashboard/patient": ["patient"],
  "/dashboard/receptionist": ["receptionist"],
  "/dashboard/patients": ["admin", "doctor", "receptionist"],
  "/dashboard/doctors": ["admin", "doctor"],
  "/dashboard/users": ["admin"],
};

const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 4,
  doctor: 3,
  receptionist: 2,
  patient: 1,
};

export function getRolesForRoute(pathname: string): UserRole[] {
  const exact = ROUTE_ROLE_MAP[pathname];
  if (exact) return exact;

  for (const [prefix, roles] of Object.entries(ROUTE_ROLE_MAP)) {
    if (pathname.startsWith(prefix + "/") || pathname === prefix) {
      return roles;
    }
  }

  return Object.keys(ROLE_HIERARCHY) as UserRole[];
}

export function canAccess(role: UserRole | null, pathname: string): boolean {
  if (!role) return false;
  const allowed = getRolesForRoute(pathname);
  return allowed.includes(role);
}

export function getRoleBadgeColor(role: UserRole): string {
  const colors: Record<UserRole, string> = {
    admin: "bg-purple-500/10 text-purple-500",
    doctor: "bg-blue-500/10 text-blue-500",
    patient: "bg-emerald-500/10 text-emerald-500",
    receptionist: "bg-amber-500/10 text-amber-500",
  };
  return colors[role];
}

export function getDefaultRouteForRole(role: UserRole): string {
  const routes: Record<UserRole, string> = {
    admin: "/dashboard/admin",
    doctor: "/dashboard/doctor",
    patient: "/dashboard/patient",
    receptionist: "/dashboard/receptionist",
  };
  return routes[role];
}

export function hasHigherRole(userRole: UserRole, targetRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[targetRole];
}
