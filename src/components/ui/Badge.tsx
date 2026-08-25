import { cn } from "@/lib/utils";

type BadgeStatus = "success" | "warning" | "danger" | "info" | "neutral";

interface BadgeProps {
  status?: BadgeStatus;
  children: React.ReactNode;
}

const STATUS_STYLES: Record<BadgeStatus, string> = {
  success: "bg-status-success/15 text-status-success",
  warning: "bg-status-warning/15 text-status-warning",
  danger: "bg-status-danger/15 text-status-danger",
  info: "bg-status-info/15 text-status-info",
  neutral: "bg-ink-faint/15 text-ink-muted",
};

export function Badge({ status = "neutral", children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-pill text-xs font-medium",
        STATUS_STYLES[status]
      )}
    >
      {children}
    </span>
  );
}