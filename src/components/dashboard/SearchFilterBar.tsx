"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectStatus } from "@/types";

const STATUS_FILTERS: { value: ProjectStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "on-track", label: "On Track" },
  { value: "at-risk", label: "At Risk" },
  { value: "delayed", label: "Delayed" },
  { value: "completed", label: "Completed" },
];

interface SearchFilterBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  activeFilter: ProjectStatus | "all";
  onFilterChange: (value: ProjectStatus | "all") => void;
}

export function SearchFilterBar({
  query,
  onQueryChange,
  activeFilter,
  onFilterChange,
}: SearchFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="relative flex-1 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search projects..."
          className="w-full bg-surface border border-surface-border rounded-card pl-9 pr-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
        {STATUS_FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onFilterChange(value)}
            aria-pressed={activeFilter === value}
            className={cn(
              "px-3 py-1.5 rounded-pill text-xs font-medium border transition-colors",
              activeFilter === value
                ? "bg-accent-muted border-accent text-accent"
                : "bg-surface-raised border-surface-border text-ink-muted hover:text-ink hover:border-ink-faint"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}