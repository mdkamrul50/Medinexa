import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "403 - Access Denied | Medinexa",
};

export default function ForbiddenPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background px-4 py-8">
      <div className="absolute inset-0 pointer-events-none opacity-[0.015] dark:opacity-[0.03]"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.5) 1px, transparent 0)", backgroundSize: "40px 40px" }}
      />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-primary/[0.08] via-secondary/[0.04] to-transparent blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-primary/[0.08] via-secondary/[0.04] to-transparent blur-3xl animate-float-reverse" />
      </div>
      <div className="relative text-center max-w-md">
        <h1 className="text-8xl font-black text-heading tracking-tight">403</h1>
        <p className="text-xl font-semibold text-heading mt-4">Access Denied</p>
        <p className="text-body mt-2 leading-relaxed">
          You don&apos;t have permission to access this page. Please contact your administrator if you believe this is a mistake.
        </p>
        <div className="flex items-center justify-center gap-4 mt-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-white font-semibold hover:bg-primary/90 transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-body font-semibold hover:text-heading hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
