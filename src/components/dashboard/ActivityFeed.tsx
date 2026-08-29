import { ActivityEvent } from "@/types";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";
import { CheckCircle2, MessageSquare, ArrowRightLeft, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const ACTION_CONFIG: Record<
  ActivityEvent["action"],
  { icon: typeof Plus; iconClass: string; verb: string }
> = {
  created: { icon: Plus, iconClass: "text-status-info", verb: "created" },
  "status-changed": { icon: ArrowRightLeft, iconClass: "text-status-warning", verb: "updated" },
  commented: { icon: MessageSquare, iconClass: "text-ink-muted", verb: "commented on" },
  completed: { icon: CheckCircle2, iconClass: "text-status-success", verb: "completed" },
};

function formatRelativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function ActivityRow({ event }: { event: ActivityEvent }) {
  const config = ACTION_CONFIG[event.action];
  const Icon = config.icon;

  return (
    <div className="flex items-start gap-3 py-3">
      <Avatar name={event.actor} size="sm" className="mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-ink leading-snug">
          <span className="font-medium">{event.actor}</span>{" "}
          <span className="text-ink-muted">{config.verb}</span>{" "}
          <span className="font-medium">{event.target}</span>
        </p>
        {event.detail && (
          <p className="text-xs text-ink-muted mt-0.5">{event.detail}</p>
        )}
        <p className="text-xs text-ink-faint mt-1">{formatRelativeTime(event.timestamp)}</p>
      </div>
      <Icon className={cn("w-4 h-4 shrink-0 mt-0.5", config.iconClass)} />
    </div>
  );
}

export function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold text-ink mb-1">Recent Activity</h3>
      <div className="divide-y divide-surface-border">
        {events.map((event) => (
          <ActivityRow key={event.id} event={event} />
        ))}
      </div>
    </Card>
  );
}

export function ActivityFeedSkeleton() {
  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold text-ink mb-1">Recent Activity</h3>
      <div className="divide-y divide-surface-border">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 py-3">
            <Skeleton className="h-6 w-6 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}