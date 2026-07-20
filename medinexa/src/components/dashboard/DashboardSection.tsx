"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface DashboardSectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export default function DashboardSection({
  title,
  subtitle,
  children,
  className = "",
  action,
}: DashboardSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border border-border bg-card p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-heading">{title}</h3>
          {subtitle && (
            <p className="text-xs text-muted mt-0.5">{subtitle}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </motion.div>
  );
}
