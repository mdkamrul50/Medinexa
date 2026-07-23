"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/10">
          <span className="text-2xl">&#9888;</span>
        </div>
        <h2 className="text-xl font-bold text-heading mb-2">Dashboard Error</h2>
        <p className="text-muted mb-6 text-sm">
          Failed to load this section. Please try again.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-all"
          >
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-heading hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
