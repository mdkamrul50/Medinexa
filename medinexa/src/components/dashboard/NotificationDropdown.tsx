"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBell,
  FiInbox,
  FiAlertCircle,
  FiRefreshCw,
  FiChevronRight,
} from "react-icons/fi";
import { Skeleton } from "./Skeleton";
import { useNotifications, formatRelativeTime } from "@/hooks/useNotifications";

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.04, duration: 0.2, ease: "easeOut" as const },
  }),
};

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const {
    notifications,
    unreadCount,
    loading,
    error,
    refetch,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border text-body hover:text-heading hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
        aria-label={`Notifications (${unreadCount} unread)`}
      >
        <FiBell className="h-4.5 w-4.5" />
        {unreadCount > 0 && (
          <motion.span
            key={unreadCount}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white shadow-sm shadow-accent/30"
          >
            {unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-[360px] sm:w-[400px] origin-top-right z-50"
          >
            <div className="rounded-2xl border border-border bg-card shadow-xl shadow-black/5 dark:shadow-black/20 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-heading">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={refetch}
                    className="p-1.5 rounded-lg text-muted hover:text-heading hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                    title="Refresh"
                  >
                    <FiRefreshCw className="h-3.5 w-3.5" />
                  </button>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-[360px] overflow-y-auto">
                {loading ? (
                  <div className="p-4 space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Skeleton variant="circular" width={8} height={8} className="mt-2 shrink-0" />
                        <div className="flex-1 space-y-1.5 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <Skeleton width="60%" height={14} />
                            <Skeleton width={50} height={10} />
                          </div>
                          <Skeleton width="85%" height={11} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center py-10 px-5 text-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-500 mb-3">
                      <FiAlertCircle className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-semibold text-heading mb-1">Failed to load</p>
                    <p className="text-xs text-muted mb-3">{error}</p>
                    <button
                      onClick={refetch}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90 transition-colors"
                    >
                      <FiRefreshCw className="h-3 w-3" />
                      Try again
                    </button>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 px-5 text-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/50 text-muted mb-3">
                      <FiInbox className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-semibold text-heading mb-1">All caught up</p>
                    <p className="text-xs text-muted">No new notifications.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/50">
                    {notifications.map((notif, i) => (
                      <motion.button
                        key={notif.id}
                        custom={i}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        onClick={() => {
                          if (notif.unread) markAsRead(notif.id);
                        }}
                        className={`w-full flex items-start gap-3.5 px-5 py-3.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group ${
                          !notif.unread ? "opacity-70 hover:opacity-100" : ""
                        }`}
                      >
                        <motion.div
                          animate={{ scale: notif.unread ? 1 : 0 }}
                          className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${
                            notif.unread ? "bg-primary" : "bg-transparent"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p
                              className={`text-sm truncate ${
                                notif.unread
                                  ? "font-bold text-heading"
                                  : "font-medium text-body"
                              }`}
                            >
                              {notif.title}
                            </p>
                            <span className="text-[10px] text-muted shrink-0">
                              {formatRelativeTime(notif.time)}
                            </span>
                          </div>
                          <p className="text-xs text-muted mt-0.5 line-clamp-2">
                            {notif.description}
                          </p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-border px-5 py-3">
                <Link
                  href="/dashboard/notifications"
                  className="flex items-center justify-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors group"
                >
                  View all notifications
                  <FiChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
