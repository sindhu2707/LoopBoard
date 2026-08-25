import { Project, Task, DashboardStats, User } from "@/types";

export const CURRENT_USER: User = {
  id: "u1",
  name: "Sarah Patel",
  role: "Frontend Engineer",
};

const PROJECTS: Project[] = [
  { id: "p1", name: "Design System v2", description: "Unify tokens and components across product surfaces.", status: "on-track", progress: 72, members: ["Sarah Patel", "Alex Kim", "Jo Chen"], taskCount: 24, completedTaskCount: 17, dueDate: "2026-09-15" },
  { id: "p2", name: "API Gateway Migration", description: "Move legacy REST endpoints to the new gateway.", status: "at-risk", progress: 41, members: ["Max Lee", "Priya Rao"], taskCount: 18, completedTaskCount: 7, dueDate: "2026-09-01" },
  { id: "p3", name: "Mobile Onboarding Revamp", description: "Redesign first-run experience for iOS and Android.", status: "delayed", progress: 25, members: ["Jo Chen", "Sarah Patel", "Max Lee", "Priya Rao"], taskCount: 30, completedTaskCount: 6, dueDate: "2026-08-30" },
  { id: "p4", name: "Analytics Pipeline", description: "Event tracking and dashboarding for product usage.", status: "completed", progress: 100, members: ["Alex Kim"], taskCount: 14, completedTaskCount: 14, dueDate: "2026-08-10" },
];

const TASKS: Task[] = [
  { id: "t1", title: "Finalize color token naming", status: "in-progress", priority: "high", projectId: "p1", assignee: "Sarah Patel", dueDate: "2026-08-25" },
  { id: "t2", title: "Audit legacy auth endpoints", status: "todo", priority: "high", projectId: "p2", assignee: "Max Lee", dueDate: "2026-08-24" },
  { id: "t3", title: "Write onboarding copy v2", status: "review", priority: "medium", projectId: "p3", assignee: "Jo Chen", dueDate: "2026-08-27" },
  { id: "t4", title: "Set up rate limiting", status: "todo", priority: "high", projectId: "p2", assignee: "Priya Rao", dueDate: "2026-08-26" },
  { id: "t5", title: "Component docs pass", status: "done", priority: "low", projectId: "p1", assignee: "Alex Kim", dueDate: "2026-08-20" },
  { id: "t6", title: "Prototype swipe gestures", status: "in-progress", priority: "medium", projectId: "p3", assignee: "Sarah Patel", dueDate: "2026-08-29" },
];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface FetchOptions {
  simulateError?: boolean;
  delayMs?: number;
}

export async function fetchProjects(opts: FetchOptions = {}): Promise<Project[]> {
  await delay(opts.delayMs ?? 900);
  if (opts.simulateError) throw new Error("Failed to load projects");
  return PROJECTS;
}

export async function fetchTasks(opts: FetchOptions = {}): Promise<Task[]> {
  await delay(opts.delayMs ?? 700);
  if (opts.simulateError) throw new Error("Failed to load tasks");
  return TASKS;
}

export async function fetchStats(opts: FetchOptions = {}): Promise<DashboardStats> {
  await delay(opts.delayMs ?? 500);
  if (opts.simulateError) throw new Error("Failed to load stats");
  return {
    activeProjects: PROJECTS.filter((p) => p.status !== "completed").length,
    tasksCompletedThisWeek: TASKS.filter((t) => t.status === "done").length,
    tasksOverdue: TASKS.filter((t) => new Date(t.dueDate) < new Date() && t.status !== "done").length,
    teamMembers: 4,
  };
}

export async function fetchEmptyProjects(): Promise<Project[]> {
  await delay(600);
  return [];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  { id: "m1", name: "Sarah Patel", role: "Frontend Engineer" },
  { id: "m2", name: "Alex Kim", role: "Product Designer" },
  { id: "m3", name: "Jo Chen", role: "Backend Engineer" },
  { id: "m4", name: "Max Lee", role: "Full-stack Engineer" },
];

export async function fetchTeamMembers(opts: FetchOptions = {}): Promise<TeamMember[]> {
  await delay(opts.delayMs ?? 600);
  if (opts.simulateError) throw new Error("Failed to load team members");
  return TEAM_MEMBERS;
}