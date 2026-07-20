"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiAlertTriangle, FiX } from "react-icons/fi";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  loading?: boolean;
}

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  loading = false,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-lg text-muted hover:text-heading hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <FiX className="h-4 w-4" />
            </button>

            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl mb-4 ${
                variant === "danger"
                  ? "bg-red-500/10 text-red-500"
                  : variant === "warning"
                    ? "bg-amber-500/10 text-amber-500"
                    : "bg-blue-500/10 text-blue-500"
              }`}
            >
              <FiAlertTriangle className="h-6 w-6" />
            </div>

            <h3 className="text-lg font-bold text-heading mb-2">{title}</h3>
            <p className="text-sm text-body mb-6">{description}</p>

            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-muted hover:text-heading bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className={`px-4 py-2 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-50 ${
                  variant === "danger"
                    ? "bg-red-500 hover:bg-red-600"
                    : variant === "warning"
                      ? "bg-amber-500 hover:bg-amber-600"
                      : "bg-primary hover:bg-primary/90"
                }`}
              >
                {loading ? "Processing..." : confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
