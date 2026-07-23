"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSun, FiMoon } from "react-icons/fi";

function getInitialTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem("theme");
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(getInitialTheme());
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  if (!mounted) {
    return (
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-slate-50 dark:bg-slate-800/40" />
    );
  }

  return (
    <button
      onClick={toggle}
      className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border text-body hover:text-heading hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {theme === "light" ? (
          <FiMoon className="h-4.5 w-4.5" />
        ) : (
          <FiSun className="h-4.5 w-4.5 text-yellow-400" />
        )}
      </motion.div>
    </button>
  );
}
