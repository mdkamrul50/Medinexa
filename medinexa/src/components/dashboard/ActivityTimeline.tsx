"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiCircle } from "react-icons/fi";
import type { ActivityItem } from "@/hooks/useDashboardData";
import EmptyState from "./EmptyState";
import { TimelineSkeleton } from "./Skeleton";

interface ActivityTimelineProps {
  items: ActivityItem[];
  loading?: boolean;
  title?: string;
}

export default function ActivityTimeline({
  items,
  loading,
}: ActivityTimelineProps) {
  if (loading) return <TimelineSkeleton />;

  if (!items || items.length === 0) {
    return (
      <EmptyState
        icon={FiCircle}
        title="No recent activity"
        description="Activity will appear here as it happens."
      />
    );
  }

  return (
    <div className="space-y-0">
      <AnimatePresence mode="popLayout">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-start gap-3 py-2.5 border-b border-border/50 last:border-0 group"
          >
            <div className="mt-1.5 flex flex-col items-center">
              <div className="h-2 w-2 rounded-full bg-primary/40 group-first:bg-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-heading truncate">
                {item.action}
              </p>
              {item.description && (
                <p className="text-xs text-muted mt-0.5 line-clamp-1">
                  {item.description}
                </p>
              )}
            </div>
            <span className="text-[11px] text-muted shrink-0 mt-0.5">
              {item.time}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
