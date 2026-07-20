"use client";

import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import Link from "next/link";

interface Action {
  label: string;
  icon: IconType;
  onClick?: () => void;
  href?: string;
  color: string;
  description?: string;
}

interface QuickActionCardProps {
  actions: Action[];
}

export default function QuickActionCard({ actions }: QuickActionCardProps) {
  if (!actions || actions.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action, i) => (
        <motion.div
          key={action.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          {action.href ? (
            <Link
              href={action.href}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-slate-50 dark:bg-slate-800/20 p-4 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:border-primary/30 transition-all group"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${action.color} text-white shadow-sm group-hover:shadow-md transition-shadow`}
              >
                <action.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-heading text-center leading-tight">
                {action.label}
              </span>
              {action.description && (
                <span className="text-[10px] text-muted text-center leading-tight hidden sm:block">
                  {action.description}
                </span>
              )}
            </Link>
          ) : (
            <button
              onClick={action.onClick}
              className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-slate-50 dark:bg-slate-800/20 p-4 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:border-primary/30 transition-all group cursor-pointer"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${action.color} text-white shadow-sm group-hover:shadow-md transition-shadow`}
              >
                <action.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-heading text-center leading-tight">
                {action.label}
              </span>
            </button>
          )}
        </motion.div>
      ))}
    </div>
  );
}
