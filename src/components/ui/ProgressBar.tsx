import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-100
  status?: "success" | "warning" | "danger" | "info";
  label?: string;
}

const FILL_COLOR = {
  success: "bg-status-success",
  warning: "bg-status-warning",
  danger: "bg-status-danger",
  info: "bg-status-info",
};

export function ProgressBar({ value, status = "info", label }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-xs text-ink-muted mb-1">
          <span>{label}</span>
          <span>{clamped}%</span>
        </div>
      )}
      <div
        className="w-full h-1.5 bg-surface-border rounded-pill overflow-hidden"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn("h-full rounded-pill transition-all", FILL_COLOR[status])}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}