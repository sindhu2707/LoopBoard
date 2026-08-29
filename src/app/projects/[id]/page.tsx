"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Project, Task } from "@/types";
import {
  fetchProjectById,
  fetchProjectTasks,
  fetchProjectMembers,
  createTask,
  updateTask,
  deleteTask,
  TeamMember,
} from "@/lib/mock-data";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Avatar } from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { TaskCard } from "@/components/dashboard/TaskCard";
import { TaskCardSkeleton } from "@/components/dashboard/TaskCardSkeleton";
import { TaskFormModal, TaskFormValues } from "@/components/dashboard/TaskFormModal";
import { ArrowLeft, CalendarDays, ListChecks, FolderX, Plus } from "lucide-react";

const STATUS_CONFIG: Record<Project["status"], { label: string; badge: "success" | "warning" | "danger" | "info"; bar: "success" | "warning" | "danger" | "info" }> = {
  "on-track": { label: "On Track", badge: "success", bar: "success" },
  "at-risk": { label: "At Risk", badge: "warning", bar: "warning" },
  delayed: { label: "Delayed", badge: "danger", bar: "danger" },
  completed: { label: "Completed", badge: "info", bar: "info" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [project, setProject] = useState<Project | null | undefined>(undefined); // undefined = loading, null = not found
  const [members, setMembers] = useState<TeamMember[] | null>(null);
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [savingTask, setSavingTask] = useState(false);

  function openCreateModal() {
  setEditingTask(null);
  setTaskModalOpen(true);
}

function openEditModal(task: Task) {
  setEditingTask(task);
  setTaskModalOpen(true);
}

async function handleTaskSubmit(values: TaskFormValues) {
  if (!project) return;
  setSavingTask(true);
  try {
    if (editingTask) {
      const updated = await updateTask(editingTask.id, values);
      setTasks((prev) => prev?.map((t) => (t.id === updated.id ? updated : t)) ?? null);
    } else {
      const created = await createTask({ ...values, projectId: project.id });
      setTasks((prev) => (prev ? [...prev, created] : [created]));
    }
    const refreshed = await fetchProjectById(project.id);
    setProject(refreshed);
    setTaskModalOpen(false);
  } catch (err) {
    alert(err instanceof Error ? err.message : "Something went wrong");
  } finally {
    setSavingTask(false);
  }
}

async function handleDeleteTask(taskId: string) {
  if (!project) return;
  if (!confirm("Delete this task? This can't be undone.")) return;

  const previousTasks = tasks;
  setTasks((prev) => prev?.filter((t) => t.id !== taskId) ?? null);

  try {
    await deleteTask(taskId);
    const refreshed = await fetchProjectById(project.id);
    setProject(refreshed);
  } catch (err) {
    setTasks(previousTasks);
    alert(err instanceof Error ? err.message : "Failed to delete task");
  }
}

  useEffect(() => {
    fetchProjectById(params.id).then(setProject);
    fetchProjectTasks(params.id).then(setTasks);
  }, [params.id]);

  useEffect(() => {
    if (project) {
      fetchProjectMembers(project.members).then(setMembers);
    }
  }, [project]);

  if (project === undefined) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full rounded-card" />
        <Skeleton className="h-48 w-full rounded-card" />
      </div>
    );
  }

  if (project === null) {
    return (
      <div className="p-4 md:p-6">
        <EmptyState
          icon={FolderX}
          title="Project not found"
          description="This project may have been removed or the link is incorrect."
        />
      </div>
    );
  }

  const config = STATUS_CONFIG[project.status];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <button
        type="button"
        onClick={() => router.push("/projects")}
        className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </button>

      {/* OVERVIEW */}
      <Card className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-ink">{project.name}</h1>
            <p className="text-sm text-ink-muted mt-1">{project.description}</p>
          </div>
          <Badge status={config.badge}>{config.label}</Badge>
        </div>

        <ProgressBar value={project.progress} status={config.bar} label="Progress" />

        <div className="flex flex-wrap items-center gap-4 text-sm text-ink-muted pt-2 border-t border-surface-border">
          <span className="flex items-center gap-1.5">
            <ListChecks className="w-4 h-4" />
            {project.completedTaskCount}/{project.taskCount} tasks completed
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4" />
            Due {formatDate(project.dueDate)}
          </span>
        </div>
      </Card>

      {/* TEAM MEMBERS */}
      <section>
        <h2 className="text-sm font-semibold text-ink mb-3">Team Members</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {members === null
            ? Array.from({ length: project.members.length || 3 }).map((_, i) => (
                <Card key={i} className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </Card>
              ))
            : members.map((m) => (
                <Card key={m.id} className="flex items-center gap-3">
                  <Avatar name={m.name} />
                  <div>
                    <p className="text-sm font-medium text-ink">{m.name}</p>
                    <p className="text-xs text-ink-muted">{m.role}</p>
                  </div>
                </Card>
              ))}
        </div>
      </section>

      {/* PROJECT TASKS */}
      <section>
        <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-ink">Tasks</h2>
            <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-1.5 text-xs font-medium text-accent hover:underline cursor-pointer"
            >
            <Plus className="w-3.5 h-3.5" />
            Add Task
            </button>
        </div>
        {tasks === null ? (
            <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
                <TaskCardSkeleton key={i} />
            ))}
            </div>
        ) : tasks.length > 0 ? (
            <div className="space-y-2">
            {tasks.map((t) => (
                <TaskCard
                key={t.id}
                task={t}
                onEdit={() => openEditModal(t)}
                onDelete={() => handleDeleteTask(t.id)}
                />
            ))}
            </div>
        ) : (
            <EmptyState
            icon={ListChecks}
            title="No tasks yet"
            description="This project has no tasks assigned."
            />
        )}
        </section>

        <TaskFormModal
        key={taskModalOpen ? (editingTask?.id ?? "new") : "closed"}
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSubmit={handleTaskSubmit}
        members={members ?? []}
        initialTask={editingTask}
        submitting={savingTask}
        />
    </div>
  );
}