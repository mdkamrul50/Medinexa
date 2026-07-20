"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiBell, FiCheck, FiMoreHorizontal } from "react-icons/fi";
import { NotificationItem } from "./types";

const notifications: NotificationItem[] = [
  {
    id: "1",
    title: "New patient admitted",
    description: "Sarah Jenkins has been admitted to Cardiology ward.",
    time: "2 min ago",
    unread: true,
  },
  {
    id: "2",
    title: "Lab results ready",
    description: "Lab results for David Miller are now available.",
    time: "15 min ago",
    unread: true,
  },
  {
    id: "3",
    title: "Appointment rescheduled",
    description: "Elena Rostova moved her appointment to 3:00 PM.",
    time: "1 hour ago",
    unread: false,
  },
  {
    id: "4",
    title: "Prescription refill request",
    description: "John Carter requested a refill for Metformin 500mg.",
    time: "3 hours ago",
    unread: false,
  },
];

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border text-body hover:text-heading hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
        aria-label={`Notifications (${unreadCount} unread)`}
      >
        <FiBell className="h-4.5 w-4.5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white shadow-sm shadow-accent/30">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-[360px] sm:w-[400px] origin-top-right"
          >
            <div className="rounded-2xl border border-border bg-card shadow-xl shadow-black/5 dark:shadow-black/20 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h3 className="text-sm font-bold text-heading">Notifications</h3>
                <button className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                  Mark all read
                </button>
              </div>

              <div className="max-h-[360px] overflow-y-auto">
                {notifications.map((notif) => (
                  <button
                    key={notif.id}
                    className="w-full flex items-start gap-3.5 px-5 py-3.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors border-b border-border/50 last:border-b-0 cursor-pointer group"
                  >
                    <div
                      className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${
                        notif.unread ? "bg-primary" : "bg-transparent"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={`text-sm ${
                            notif.unread
                              ? "font-bold text-heading"
                              : "font-medium text-body"
                          } truncate`}
                        >
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-muted shrink-0">
                          {notif.time}
                        </span>
                      </div>
                      <p className="text-xs text-muted mt-0.5 line-clamp-2">
                        {notif.description}
                      </p>
                    </div>
                    <button className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted hover:text-heading">
                      <FiMoreHorizontal className="h-4 w-4" />
                    </button>
                  </button>
                ))}
              </div>

              <div className="border-t border-border px-5 py-3">
                <button className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                  <FiCheck className="h-3.5 w-3.5" />
                  View all notifications
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
