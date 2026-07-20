"use client";

import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className = "",
  variant = "text",
  width,
  height,
}: SkeletonProps) {
  const base = "animate-pulse bg-slate-200 dark:bg-slate-700/60";
  const variantClass =
    variant === "circular" ? "rounded-full" : variant === "rectangular" ? "rounded-2xl" : "rounded-lg";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`${base} ${variantClass} ${className}`}
      style={{ width, height }}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton variant="rectangular" width={40} height={40} className="rounded-xl" />
      </div>
      <Skeleton width="60%" height={14} className="mb-2" />
      <Skeleton width="40%" height={28} className="mb-2" />
      <Skeleton width="30%" height={12} />
    </div>
  );
}

export function TableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-3">
          <Skeleton variant="circular" width={32} height={32} />
          <div className="flex-1 space-y-1.5">
            <Skeleton width="50%" height={14} />
            <Skeleton width="30%" height={11} />
          </div>
          <Skeleton width={60} height={20} className="rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function TimelineSkeleton({ items = 4 }: { items?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-start gap-3">
          <Skeleton variant="circular" width={8} height={8} className="mt-2" />
          <div className="flex-1 space-y-1.5">
            <Skeleton width="60%" height={14} />
            <Skeleton width="30%" height={11} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SectionSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <Skeleton width="40%" height={18} className="mb-4" />
      <TableSkeleton rows={3} />
    </div>
  );
}
