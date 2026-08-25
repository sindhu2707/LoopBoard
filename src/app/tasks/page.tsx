"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Task } from "@/types";
import { fetchTasks } from "@/lib/mock-data";
import { TaskCard } from "@/components/dashboard/TaskCard";
import { TaskCardSkeleton } from "@/components/dashboard/TaskCardSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ListChecks } from "lucide-react";

function isOverdue(task: Task) {
  return new Date(task.dueDate) < new Date() && task.status !== "done";
}

function TasksContent() {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const overdue = searchParams.get("overdue") === "true";

  useEffect(() => {
    fetchTasks().then(setTasks);
  }, []);

  const filtered = tasks
    ? overdue
      ? tasks.filter(isOverdue)
      : status
      ? tasks.filter((t) => t.status === status)
      : tasks
    : null;

  const heading = overdue
    ? "Overdue tasks"
    : status === "done"
    ? "Completed tasks"
    : "Tasks";

  const subtitle = overdue
    ? "Tasks past their due date that aren't done yet"
    : status === "done"
    ? "Tasks marked as done"
    : null;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">{heading}</h1>
        {subtitle && <p className="text-sm text-ink-muted mt-1">{subtitle}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered === null
          ? Array.from({ length: 6 }).map((_, i) => <TaskCardSkeleton key={i} />)
          : filtered.length > 0
          ? filtered.map((t) => <TaskCard key={t.id} task={t} />)
          : (
            <div className="col-span-full">
              <EmptyState
                icon={ListChecks}
                title="No tasks found"
                description="Nothing matches this filter right now."
              />
            </div>
          )}
      </div>
    </div>
  );
}

export default function TasksPage() {
  return (
    <Suspense fallback={null}>
      <TasksContent />
    </Suspense>
  );
}