"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Yes",
  cancelLabel = "No",
  danger = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    if (open) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onCancel}>
      <div
        className="w-full max-w-sm bg-surface-raised border border-surface-border rounded-card shadow-card p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          {danger && (
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-status-danger/15 shrink-0">
              <AlertTriangle className="w-4 h-4 text-status-danger" />
            </span>
          )}
          <div>
            <h2 className="text-sm font-semibold text-ink">{title}</h2>
            <p className="text-sm text-ink-muted mt-1">{message}</p>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-1.5 rounded-md text-sm font-medium text-ink-muted hover:text-ink hover:bg-surface cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium text-white cursor-pointer",
              danger ? "bg-status-danger" : "bg-accent"
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}