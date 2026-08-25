import { Card } from "@/components/ui/Card";
import { FolderKanban, CheckCircle2, AlertTriangle, Users } from "lucide-react";
import { DashboardStats } from "@/types";
import Link from "next/link";

interface StatsRowProps {
  stats: DashboardStats;
}

const STAT_CONFIG = [
  { key: "activeProjects", label: "Active Projects", icon: FolderKanban, color: "text-status-info", href: "/projects?filter=active" },
  { key: "tasksCompletedThisWeek", label: "Completed This Week", icon: CheckCircle2, color: "text-status-success", href: "/tasks?status=done" },
  { key: "tasksOverdue", label: "Overdue Tasks", icon: AlertTriangle, color: "text-status-danger", href: "/tasks?overdue=true" },
  { key: "teamMembers", label: "Team Members", icon: Users, color: "text-accent", href: "/team" },
] as const;

export function StatsRow({ stats }: StatsRowProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {STAT_CONFIG.map(({ key, label, icon: Icon, color, href }) => (
        <Link
          key={key}
          href={href}
          className="block rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Card hoverable className="h-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-ink-muted">{label}</span>
              <Icon size={16} className={color} />
            </div>
            <span className="text-2xl font-semibold text-ink">{stats[key]}</span>
          </Card>
        </Link>
      ))}
    </div>
  );
} 