"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Project,
  Task,
  DashboardStats,
  ProjectStatus,
} from "@/types";
import {
  fetchProjects,
  fetchTasks,
  fetchStats,
} from "@/lib/mock-data";
import { useDebounce } from "../lib/hooks/useDebounce";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { StatsRowSkeleton } from "@/components/dashboard/StatsRowSkeleton";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { ProjectCardSkeleton } from "@/components/dashboard/ProjectCardSkeleton";
import { TaskCard } from "@/components/dashboard/TaskCard";
import { TaskCardSkeleton } from "@/components/dashboard/TaskCardSkeleton";
import { SearchFilterBar } from "@/components/dashboard/SearchFilterBar";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  SearchX,
  FolderOpen,
  ListTodo,
  AlertCircle,
  RotateCw,
} from "lucide-react";

type FetchState<T> = {
  data: T | null;
  error: string | null;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<FetchState<DashboardStats>>({
    data: null,
    error: null,
  });

  const [projects, setProjects] = useState<FetchState<Project[]>>({
    data: null,
    error: null,
  });

  const [tasks, setTasks] = useState<FetchState<Task[]>>({
    data: null,
    error: null,
  });

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<ProjectStatus | "all">("all");

  const debouncedQuery = useDebounce(query, 300);

  const loadStats = useCallback(() => {
    setStats({
      data: null,
      error: null,
    });

    fetchStats()
      .then((data) => {
        setStats({
          data,
          error: null,
        });
      })
      .catch((err: unknown) => {
        setStats({
          data: null,
          error:
            err instanceof Error
              ? err.message
              : "Failed to load dashboard statistics.",
        });
      });
  }, []);

  const loadProjects = useCallback(() => {
    setProjects({
      data: null,
      error: null,
    });

    fetchProjects()
      .then((data) => {
        setProjects({
          data,
          error: null,
        });
      })
      .catch((err: unknown) => {
        setProjects({
          data: null,
          error:
            err instanceof Error
              ? err.message
              : "Failed to load projects.",
        });
      });
  }, []);

  const loadTasks = useCallback(() => {
    setTasks({
      data: null,
      error: null,
    });

    fetchTasks()
      .then((data) => {
        setTasks({
          data,
          error: null,
        });
      })
      .catch((err: unknown) => {
        setTasks({
          data: null,
          error:
            err instanceof Error
              ? err.message
              : "Failed to load tasks.",
        });
      });
  }, []);

  useEffect(() => {
    loadStats();
    loadProjects();
    loadTasks();
  }, [loadStats, loadProjects, loadTasks]);

  const filteredProjects = useMemo(() => {
    if (!projects.data) return null;

    return projects.data.filter((p) => {
      const matchesQuery = p.name
        .toLowerCase()
        .includes(debouncedQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || p.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [projects.data, debouncedQuery, statusFilter]);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">
          Dashboard
        </h1>

        <p className="text-sm text-ink-muted mt-1">
          Welcome back, here&apos;s what&apos;s happening across your
          projects.
        </p>
      </div>

      {/* STATS */}
      {stats.error ? (
        <ErrorBanner
          message={stats.error}
          onRetry={loadStats}
        />
      ) : stats.data ? (
        <StatsRow stats={stats.data} />
      ) : (
        <StatsRowSkeleton />
      )}

      {/* PROJECTS */}
      <section>
        <h2 className="text-sm font-semibold text-ink mb-3">
          Projects
        </h2>

        <SearchFilterBar
          query={query}
          onQueryChange={setQuery}
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />

        <div className="mt-4">
          {projects.error ? (
            <ErrorBanner
              message={projects.error}
              onRetry={loadProjects}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {projects.data === null ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <ProjectCardSkeleton key={i} />
                ))
              ) : filteredProjects &&
                filteredProjects.length > 0 ? (
                filteredProjects.map((p) => (
                  <ProjectCard
                    key={p.id}
                    project={p}
                  />
                ))
              ) : projects.data.length === 0 ? (
                <div className="col-span-full">
                  <EmptyState
                    icon={FolderOpen}
                    title="No projects yet"
                    description="Create your first project to start tracking progress."
                  />
                </div>
              ) : (
                <div className="col-span-full">
                  <EmptyState
                    icon={SearchX}
                    title="No projects match"
                    description="Try adjusting your search or filter to find what you're looking for."
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* TASKS */}
      <section>
        <h2 className="text-sm font-semibold text-ink mb-3">
          Recent Tasks
        </h2>

        {tasks.error ? (
          <ErrorBanner
            message={tasks.error}
            onRetry={loadTasks}
          />
        ) : tasks.data === null ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <TaskCardSkeleton key={i} />
            ))}
          </div>
        ) : tasks.data.length === 0 ? (
          <EmptyState
            icon={ListTodo}
            title="No tasks yet"
            description="Tasks assigned to your projects will show up here."
          />
        ) : (
          <div className="space-y-2">
            {tasks.data.map((t) => (
              <TaskCard
                key={t.id}
                task={t}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ErrorBanner({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 bg-status-danger/10 border border-status-danger/30 rounded-card px-4 py-3">
      <div className="flex items-center gap-2 text-sm text-status-danger">
        <AlertCircle size={16} />

        <span>{message}</span>
      </div>

      <button
        type="button"
        onClick={onRetry}
        className="flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-ink"
      >
        <RotateCw size={13} />
        Retry
      </button>
    </div>
  );
}