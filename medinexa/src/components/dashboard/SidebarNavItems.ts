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
} from "react-icons/fi";
import { NavItem } from "./types";

export const mainNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: FiGrid },
  { label: "Patients", href: "/dashboard/patients", icon: FiUsers },
  { label: "Doctors", href: "/dashboard/doctors", icon: FiUserCheck },
  { label: "Appointments", href: "/dashboard/appointments", icon: FiCalendar },
  { label: "Departments", href: "/dashboard/departments", icon: FiDepartments },
  { label: "Laboratory", href: "/dashboard/laboratory", icon: FiActivity },
  { label: "Pharmacy", href: "/dashboard/pharmacy", icon: FiPackage },
  { label: "Billing", href: "/dashboard/billing", icon: FiDollarSign },
  { label: "Reports", href: "/dashboard/reports", icon: FiBarChart2 },
  { label: "Settings", href: "/dashboard/settings", icon: FiSettings },
];

export const bottomNavItems: NavItem[] = [
  { label: "Help Center", href: "/dashboard/help", icon: FiHelpCircle },
  { label: "Logout", href: "/logout", icon: FiLogOut },
];
