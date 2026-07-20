"use client";

import { useState, ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import { useUser } from "@/hooks/useUser";
import { getRoleBadgeColor } from "@/lib/auth-utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { role, isAuthenticated } = useUser();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((p) => !p)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {isAuthenticated && role && (
          <div className={`sticky top-0 z-30 hidden lg:flex items-center justify-end px-6 py-1.5 text-[11px] font-semibold tracking-wide uppercase ${getRoleBadgeColor(role)} border-b border-border`}>
            {role} Access
          </div>
        )}
        <TopNavbar
          onMobileMenuToggle={() => setMobileSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
