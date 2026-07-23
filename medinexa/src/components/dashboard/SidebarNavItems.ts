import {
  FiGrid,
  FiUsers,
  FiUserCheck,
  FiCalendar,
  FiGrid as FiDepartments,
  FiActivity,
  FiPackage,
  FiDollarSign,
  FiBarChart2,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiFileText,
  FiClock,
  FiUserPlus,
  FiUser,
} from "react-icons/fi";
import { IconType } from "react-icons";
import type { UserRole } from "@/lib/auth-utils";

export interface RoleNavItem {
  label: string;
  href: string;
  icon: IconType;
  badge?: number;
}

const adminNav: RoleNavItem[] = [
  { label: "Dashboard", href: "/dashboard/admin", icon: FiGrid },
  { label: "Patients", href: "/dashboard/patients", icon: FiUsers },
  { label: "Doctors", href: "/dashboard/doctors", icon: FiUserCheck },
  { label: "Departments", href: "/dashboard/departments", icon: FiDepartments },
  { label: "Appointments", href: "/dashboard/appointments", icon: FiCalendar },
  { label: "Laboratory", href: "/dashboard/laboratory", icon: FiActivity },
  { label: "Pharmacy", href: "/dashboard/pharmacy", icon: FiPackage },
  { label: "Billing", href: "/dashboard/billing", icon: FiDollarSign },
  { label: "Reports", href: "/dashboard/reports", icon: FiBarChart2 },
  { label: "Profile", href: "/dashboard/profile", icon: FiUser },
  { label: "Settings", href: "/dashboard/settings", icon: FiSettings },
];

const doctorNav: RoleNavItem[] = [
  { label: "Dashboard", href: "/dashboard/doctor", icon: FiGrid },
  { label: "My Patients", href: "/dashboard/patients", icon: FiUsers },
  { label: "Appointments", href: "/dashboard/appointments", icon: FiCalendar },
  { label: "Prescriptions", href: "/dashboard/prescriptions", icon: FiFileText },
  { label: "Schedule", href: "/dashboard/schedule", icon: FiClock },
  { label: "Profile", href: "/dashboard/profile", icon: FiUser },
];

const patientNav: RoleNavItem[] = [
  { label: "Dashboard", href: "/dashboard/patient", icon: FiGrid },
  { label: "My Appointments", href: "/dashboard/appointments", icon: FiCalendar },
  { label: "Medical Records", href: "/dashboard/records", icon: FiFileText },
  { label: "Prescriptions", href: "/dashboard/prescriptions", icon: FiFileText },
  { label: "Profile", href: "/dashboard/profile", icon: FiUser },
];

const receptionistNav: RoleNavItem[] = [
  { label: "Dashboard", href: "/dashboard/receptionist", icon: FiGrid },
  { label: "Appointments", href: "/dashboard/appointments", icon: FiCalendar },
  { label: "Patient Registration", href: "/dashboard/patients", icon: FiUserPlus },
  { label: "Billing", href: "/dashboard/billing", icon: FiDollarSign },
  { label: "Profile", href: "/dashboard/profile", icon: FiUser },
];

export const roleNavMap: Record<UserRole, RoleNavItem[]> = {
  admin: adminNav,
  doctor: doctorNav,
  patient: patientNav,
  receptionist: receptionistNav,
};

export const bottomNavItems: RoleNavItem[] = [
  { label: "Help Center", href: "/dashboard/help", icon: FiHelpCircle },
  { label: "Logout", href: "/logout", icon: FiLogOut },
];
