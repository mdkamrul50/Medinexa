"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/10">
          <span className="text-3xl">&#9888;</span>
        </div>
        <h1 className="text-2xl font-bold text-heading mb-2">Something went wrong</h1>
        <p className="text-muted mb-6">
          An unexpected error occurred. Please try again.
        </p>
        {error.digest && (
          <p className="text-xs text-muted/60 mb-4">Error ID: {error.digest}</p>
        )}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-all"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-heading hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
