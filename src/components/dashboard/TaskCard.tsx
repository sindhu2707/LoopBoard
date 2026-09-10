  import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Task, TaskStatus, TaskPriority } from "@/types";
import { cn } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";

const STATUS_CONFIG: Record<TaskStatus, { label: string; badge: "success" | "warning" | "danger" | "info" | "neutral" }> = {
  todo: { label: "To Do", badge: "neutral" },
  "in-progress": { label: "In Progress", badge: "info" },
  review: { label: "In Review", badge: "warning" },
  done: { label: "Done", badge: "success" },
};

const PRIORITY_DOT: Record<TaskPriority, string> = {
  low: "bg-ink-faint",
  medium: "bg-status-warning",
  high: "bg-status-danger",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface TaskCardProps {
  task: Task;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const status = STATUS_CONFIG[task.status];
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "done";

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-surface-raised border border-surface-border rounded-card hover:border-accent/50 transition-colors">
      <span
        className={cn("w-2 h-2 rounded-full shrink-0", PRIORITY_DOT[task.priority])}
        title={`${task.priority} priority`}
        aria-label={`${task.priority} priority`}
      />
      <span className="flex-1 text-sm text-ink truncate">{task.title}</span>
      <Badge status={status.badge}>{status.label}</Badge>
      <span
        className={cn(
          "text-xs shrink-0 hidden sm:inline",
          isOverdue ? "text-status-danger" : "text-ink-muted"
        )}
      >
        {formatDate(task.dueDate)}
      </span>
      <Avatar name={task.assignee ?? "Unassigned"} size="sm" />
      {(onEdit || onDelete) && (
        <div className="flex items-center gap-1 shrink-0">
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              aria-label="Edit task"
              className="p-1.5 rounded-md text-ink-muted hover:text-ink hover:bg-surface cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              aria-label="Delete task"
              className="p-1.5 rounded-md text-ink-muted hover:text-status-danger hover:bg-surface cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}