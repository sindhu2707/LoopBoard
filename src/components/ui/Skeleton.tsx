import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse bg-surface-border rounded-card", className)}
      aria-hidden="true"
    />
  );
}