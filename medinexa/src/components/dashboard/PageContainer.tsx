"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import Breadcrumb from "./Breadcrumb";
import { BreadcrumbItem } from "./types";

interface PageContainerProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  children: ReactNode;
}

export default function PageContainer({
  title,
  subtitle,
  breadcrumbs,
  actions,
  children,
}: PageContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6"
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="mb-5">
          <Breadcrumb items={breadcrumbs} />
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-heading tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1.5 text-base text-body max-w-2xl">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3 shrink-0">{actions}</div>
        )}
      </div>

      <div className="w-full">{children}</div>
    </motion.div>
  );
}
