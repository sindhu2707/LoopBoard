"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Project } from "@/types";
import { fetchProjects } from "@/lib/mock-data";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { ProjectCardSkeleton } from "@/components/dashboard/ProjectCardSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { FolderOpen } from "lucide-react";

function ProjectsContent() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter");

  useEffect(() => {
    fetchProjects().then(setProjects);
  }, []);

  const filtered = projects
    ? filter === "active"
      ? projects.filter((p) => p.status !== "completed")
      : projects
    : null;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Projects</h1>
        {filter === "active" && (
          <p className="text-sm text-ink-muted mt-1">Showing active projects only</p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered === null
          ? Array.from({ length: 6 }).map((_, i) => <ProjectCardSkeleton key={i} />)
          : filtered.length > 0
          ? filtered.map((p) => <ProjectCard key={p.id} project={p} />)
          : (
            <div className="col-span-full">
              <EmptyState
                icon={FolderOpen}
                title="No projects found"
                description="Nothing matches this filter right now."
              />
            </div>
          )}
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={null}>
      <ProjectsContent />
    </Suspense>
  );
}