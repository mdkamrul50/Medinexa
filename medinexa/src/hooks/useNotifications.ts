"use client";

import { useState, useCallback, useRef } from "react";
import type { NotificationItem } from "@/components/dashboard/types";

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "New patient admitted",
    description: "Sarah Jenkins has been admitted to Cardiology ward.",
    time: "2026-07-20T14:30:00Z",
    unread: true,
  },
  {
    id: "2",
    title: "Lab results ready",
    description: "Lab results for David Miller are now available.",
    time: "2026-07-20T13:45:00Z",
    unread: true,
  },
  {
    id: "3",
    title: "Appointment rescheduled",
    description: "Elena Rostova moved her appointment to 3:00 PM.",
    time: "2026-07-20T12:00:00Z",
    unread: false,
  },
  {
    id: "4",
    title: "Prescription refill request",
    description: "John Carter requested a refill for Metformin 500mg.",
    time: "2026-07-20T10:00:00Z",
    unread: false,
  },
  {
    id: "5",
    title: "Staff meeting reminder",
    description: "Weekly staff meeting tomorrow at 9:00 AM in Conference Room A.",
    time: "2026-07-19T16:00:00Z",
    unread: false,
  },
];

const MIN_LOADING_MS = 800;

export function useNotifications() {
  const [items, setItems] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadingTimer = useRef<NodeJS.Timeout | undefined>(undefined);

  const startLoading = useCallback(() => {
    setLoading(true);
    setError(null);
    clearTimeout(loadingTimer.current);
    loadingTimer.current = setTimeout(() => {
      setLoading(false);
    }, MIN_LOADING_MS);
  }, []);

  const refetch = useCallback(() => {
    startLoading();
  }, [startLoading]);

  const markAsRead = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  const unreadCount = items.filter((n) => n.unread).length;

  return {
    notifications: items,
    unreadCount,
    loading,
    error,
    refetch,
    markAsRead,
    markAllAsRead,
  };
}

export function formatRelativeTime(isoString: string): string {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffMs = now - then;

  if (diffMs < 0) return "just now";

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;

  return new Date(isoString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
