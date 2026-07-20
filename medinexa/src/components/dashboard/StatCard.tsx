"use client";

import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import { StatCardSkeleton } from "./Skeleton";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: IconType;
  color: string;
  trend?: { value: string; positive: boolean };
  loading?: boolean;
  prefix?: string;
  suffix?: string;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  color,
  trend,
  loading,
  prefix,
  suffix,
}: StatCardProps) {
  if (loading) return <StatCardSkeleton />;

  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="group relative rounded-2xl border border-border bg-card p-6 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-300"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300" />
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow-sm`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="text-sm font-semibold text-muted">{label}</p>
      <p className="text-3xl font-extrabold text-heading tracking-tight mt-1">
        {prefix}{value}{suffix}
      </p>
      {trend && (
        <div className="flex items-center gap-1.5 mt-2">
          <span
            className={`inline-block h-1.5 w-1.5 rounded-full ${
              trend.positive ? "bg-emerald-500" : "bg-red-500"
            }`}
          />
          <span
            className={`text-xs font-medium ${
              trend.positive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
            }`}
          >
            {trend.value}
          </span>
        </div>
      )}
    </motion.div>
  );
}
