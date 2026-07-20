import { IconType } from "react-icons";

export type UserRole = "admin" | "doctor" | "patient" | "receptionist";

export interface NavItem {
  label: string;
  href: string;
  icon: IconType;
  badge?: number;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  avatar?: string;
}

export interface UserData {
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}
