export type TaskStatus = "todo" | "in-progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type ProjectStatus = "on-track" | "at-risk" | "delayed" | "completed";

export interface User {
  id: string;
  name: string;
  role: string;
  avatarInitials?: string;
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  assignee: string;
  dueDate: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  members: string[];
  taskCount: number;
  completedTaskCount: number;
  dueDate: string;
}

export interface DashboardStats {
  activeProjects: number;
  tasksCompletedThisWeek: number;
  tasksOverdue: number;
  teamMembers: number;
}