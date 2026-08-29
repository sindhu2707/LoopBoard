import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AvatarStack } from "@/components/ui/Avatar";
import { Project, ProjectStatus } from "@/types";
import { CalendarDays } from "lucide-react";

const STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; badge: "success" | "warning" | "danger" | "info"; bar: "success" | "warning" | "danger" | "info" }
> = {
  "on-track": { label: "On Track", badge: "success", bar: "success" },
  "at-risk": { label: "At Risk", badge: "warning", bar: "warning" },
  delayed: { label: "Delayed", badge: "danger", bar: "danger" },
  completed: { label: "Completed", badge: "info", bar: "info" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ProjectCard({ project }: { project: Project }) {
  const config = STATUS_CONFIG[project.status];

  return (
    <Link href={`/projects/${project.id}`} className="block">
      <Card hoverable className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-ink text-sm leading-tight">{project.name}</h3>
          <Badge status={config.badge}>{config.label}</Badge>
        </div>
        <p className="text-xs text-ink-muted line-clamp-2">{project.description}</p>
        <ProgressBar value={project.progress} status={config.bar} />
        <div className="flex items-center justify-between pt-1">
          <AvatarStack names={project.members} />
          <div className="flex items-center gap-3 text-xs text-ink-muted">
            <span>{project.completedTaskCount}/{project.taskCount} tasks</span>
            <span className="flex items-center gap-1">
              <CalendarDays size={13} />
              {formatDate(project.dueDate)}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}