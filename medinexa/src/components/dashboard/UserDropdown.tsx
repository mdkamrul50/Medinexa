"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiSettings,
  FiLogOut,
  FiChevronDown,
  FiLoader,
} from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { useUser } from "@/hooks/useUser";

export default function UserDropdown() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { user, role, isPending, isAuthenticated } = useUser();

  const displayName = user?.name ?? "Guest";
  const displayEmail = user?.email ?? "";
  const displayImage = user?.image ?? null;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await authClient.signOut();
    router.push("/");
  };

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 rounded-xl border border-border bg-slate-50 dark:bg-slate-800/40 px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:border-primary/30 transition-all cursor-pointer"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-blue-500 text-[10px] font-bold text-white shadow-sm overflow-hidden">
          {isPending ? (
            <FiLoader className="h-3.5 w-3.5 animate-spin" />
          ) : displayImage ? (
            <img src={displayImage} alt="" className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-xs font-semibold text-heading leading-tight max-w-[100px] truncate">
            {displayName}
          </p>
          <p className="text-[10px] text-muted capitalize leading-tight">
            {isAuthenticated && role ? role : "Guest"}
          </p>
        </div>
        <FiChevronDown
          className={`h-3.5 w-3.5 text-muted transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-[240px] origin-top-right"
          >
            <div className="rounded-2xl border border-border bg-card shadow-xl shadow-black/5 dark:shadow-black/20 overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-500 text-sm font-bold text-white shadow-sm overflow-hidden">
                  {displayImage ? (
                    <img src={displayImage} alt="" className="h-full w-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-heading truncate">{displayName}</p>
                  <p className="text-xs text-muted truncate">{displayEmail}</p>
                </div>
              </div>

              <div className="p-1.5">
                {[
                  { label: "My Profile", icon: FiUser, href: "/dashboard/profile" },
                  { label: "Settings", icon: FiSettings, href: "/dashboard/settings" },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-body hover:text-heading hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <item.icon className="h-4 w-4 text-muted" />
                    {item.label}
                  </a>
                ))}
              </div>

              <div className="border-t border-border p-1.5">
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-50"
                >
                  {isSigningOut ? (
                    <FiLoader className="h-4 w-4 animate-spin" />
                  ) : (
                    <FiLogOut className="h-4 w-4" />
                  )}
                  {isSigningOut ? "Signing out..." : "Logout"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
