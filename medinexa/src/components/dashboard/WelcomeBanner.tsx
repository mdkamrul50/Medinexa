"use client";

import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import type { UserRole } from "@/lib/auth-utils";
import { getRoleBadgeColor } from "@/lib/auth-utils";

interface WelcomeBannerProps {
  name: string;
  role: UserRole;
  icon: IconType;
  title: string;
  description: string;
}

export default function WelcomeBanner({
  name,
  role,
  icon: Icon,
  title,
  description,
}: WelcomeBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card p-6 sm:p-8"
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${getRoleBadgeColor(role)}`}
        >
          <Icon className="h-7 w-7" />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-heading">{title}</h2>
          <p className="text-sm text-body mt-0.5">
            {description}
          </p>
          <span
            className={`inline-block mt-2 text-[11px] font-semibold px-2.5 py-0.5 rounded-full capitalize ${getRoleBadgeColor(role)}`}
          >
            {role} • {name}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
