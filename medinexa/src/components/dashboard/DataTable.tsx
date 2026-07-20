"use client";

import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EmptyState from "./EmptyState";
import { TableSkeleton } from "./Skeleton";

interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  keyExtractor: (item: T) => string;
}

export default function DataTable<T>({
  columns,
  data,
  loading,
  emptyTitle = "No data available",
  emptyDescription,
  keyExtractor,
}: DataTableProps<T>) {
  if (loading) return <TableSkeleton />;

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className="space-y-1">
      <AnimatePresence mode="popLayout">
        {data.map((item, i) => (
          <motion.div
            key={keyExtractor(item)}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-center justify-between rounded-xl px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
          >
            {columns.map((col) => (
              <div key={col.key} className={col.className ?? ""}>
                {col.render(item)}
              </div>
            ))}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
