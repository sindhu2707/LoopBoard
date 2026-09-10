"use client";

import { useState } from "react";
import { Sparkles, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AITaskSuggestion } from "@/lib/api/ai";
import { TaskPriority } from "@/types";

interface AITaskSuggestionsModalProps {
  open: boolean;
  onClose: () => void;
  loading: boolean;
  error: string | null;
  suggestions: AITaskSuggestion[];
  onConfirm: (selected: AITaskSuggestion[]) => void;
  submitting: boolean;
}

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  high: "text-status-danger",
  medium: "text-status-warning",
  low: "text-ink-muted",
};

export function AITaskSuggestionsModal({
  open,
  onClose,
  loading,
  error,
  suggestions,
  onConfirm,
  submitting,
}: AITaskSuggestionsModalProps) {
  const [selected, setSelected] = useState<Set<number>>(new Set());

  if (!open) return null;

  // Default to all-selected once suggestions arrive.
  if (suggestions.length > 0 && selected.size === 0 && !loading) {
    setSelected(new Set(suggestions.map((_, i) => i)));
  }

  function toggle(index: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function handleConfirm() {
    onConfirm(suggestions.filter((_, i) => selected.has(i)));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md bg-surface-raised border border-surface-border rounded-card shadow-card max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border">
          <h2 className="text-sm font-semibold text-ink flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-accent" />
            AI-suggested tasks
          </h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-ink-muted hover:text-ink cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {loading && (
            <div className="flex items-center gap-2 text-sm text-ink-muted py-6 justify-center">
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating suggestions...
            </div>
          )}

          {error && !loading && (
            <p className="text-sm text-status-danger">{error}</p>
          )}

          {!loading && !error && suggestions.length === 0 && (
            <p className="text-sm text-ink-muted">No suggestions returned.</p>
          )}

          {!loading &&
            suggestions.map((s, i) => (
              <label
                key={i}
                className="flex items-start gap-3 rounded-md border border-surface-border px-3 py-2.5 cursor-pointer hover:border-accent/50"
              >
                <input
                  type="checkbox"
                  checked={selected.has(i)}
                  onChange={() => toggle(i)}
                  className="mt-1 cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ink font-medium">{s.title}</p>
                  <p className="text-xs text-ink-muted mt-0.5">
                    Due {s.dueDate} ·{" "}
                    <span className={cn("font-medium", PRIORITY_STYLES[s.priority])}>
                      {s.priority} priority
                    </span>
                  </p>
                </div>
              </label>
            ))}
        </div>

        {!loading && suggestions.length > 0 && (
          <div className="flex justify-end gap-2 px-4 pb-4">
            <button type="button" onClick={onClose} className="px-3 py-1.5 text-sm text-ink-muted hover:text-ink cursor-pointer">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={submitting || selected.size === 0}
              className={cn(
                "px-4 py-1.5 rounded-md text-sm font-medium bg-accent text-white cursor-pointer",
                (submitting || selected.size === 0) && "opacity-60 cursor-not-allowed"
              )}
            >
              {submitting ? "Adding..." : `Add ${selected.size} task${selected.size === 1 ? "" : "s"}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}