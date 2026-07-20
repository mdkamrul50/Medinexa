"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiX, FiCommand } from "react-icons/fi";

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((p) => !p);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl border border-border bg-slate-50 dark:bg-slate-800/40 px-3.5 py-2 text-sm text-muted hover:text-heading hover:border-primary/30 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all min-w-[200px] sm:min-w-[260px] cursor-pointer"
      >
        <FiSearch className="h-4 w-4 shrink-0" />
        <span className="flex-1 text-left">Search patients, records...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md border border-border bg-white dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-muted">
          <FiCommand className="h-3 w-3" />K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
          >
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => {
                setOpen(false);
                setQuery("");
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-xl rounded-2xl border border-border bg-card shadow-2xl shadow-black/10 overflow-hidden"
            >
              <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
                <FiSearch className="h-5 w-5 text-muted shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search patients, doctors, appointments..."
                  className="flex-1 bg-transparent text-sm text-heading outline-none placeholder:text-muted"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="flex h-5 w-5 items-center justify-center rounded-full text-muted hover:text-heading hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <FiX className="h-3.5 w-3.5" />
                  </button>
                )}
                <kbd className="hidden sm:inline-flex items-center rounded-md border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted">
                  ESC
                </kbd>
              </div>
              <div className="p-2 max-h-72 overflow-y-auto">
                {query ? (
                  <div className="px-3 py-8 text-center text-sm text-muted">
                    No results found for &quot;{query}&quot;
                  </div>
                ) : (
                  <div className="px-3 py-6 text-center text-sm text-muted">
                    Start typing to search across patients, records, and more
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
