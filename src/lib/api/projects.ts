import { Project, ProjectStatus, TeamMember } from "@/types";
import { api } from "@/lib/api";
import { fetchTeamMembers } from "@/lib/api/team";

export interface CreateProjectInput {
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  memberIds: string[];
  dueDate: string;
}

export type UpdateProjectInput = Partial<CreateProjectInput>;

export async function fetchProjects(): Promise<Project[]> {
  return api.get<Project[]>("/api/projects");
}

export async function fetchProjectById(id: string): Promise<Project | null> {
  try {
    return await api.get<Project>(`/api/projects/${id}`);
  } catch {
    return null;
  }
}

export async function fetchProjectMembers(memberIds: string[]): Promise<TeamMember[]> {
  const all = await fetchTeamMembers();
  return all.filter((m) => memberIds.includes(m.id));
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  return api.post<Project>("/api/projects", { ...input, progress: input.progress ?? 0 });
}

export async function updateProject(id: string, input: UpdateProjectInput): Promise<Project> {
  return api.patch<Project>(`/api/projects/${id}`, input);
}

export async function deleteProject(id: string): Promise<void> {
  return api.delete<void>(`/api/projects/${id}`);
}