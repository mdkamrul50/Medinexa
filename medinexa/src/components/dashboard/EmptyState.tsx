"use client";

import { motion } from "framer-motion";
import { FiInbox } from "react-icons/fi";
import type { IconType } from "react-icons";
import Link from "next/link";

interface EmptyStateProps {
  icon?: IconType;
  title: string;
  description?: string;
  action?: { label: string; onClick?: () => void; href?: string };
}

export default function EmptyState({
  icon: Icon = FiInbox,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800/50 mb-4">
        <Icon className="h-6 w-6 text-muted" />
      </div>
      <h3 className="text-base font-bold text-heading mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-body max-w-xs">{description}</p>
      )}
      {action && (
        <div className="mt-4">
          {action.href ? (
            <Link
              href={action.href}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
            >
              {action.label}
            </Link>
          ) : (
            <button
              onClick={action.onClick}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
            >
              {action.label}
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
