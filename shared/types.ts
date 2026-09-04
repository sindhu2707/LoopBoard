export type TaskStatus = "todo" | "in-progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type ProjectStatus = "on-track" | "at-risk" | "delayed" | "completed";
export type ActivityAction = "created" | "status-changed" | "commented" | "completed";

export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  password?: string; // mock-only, never do this in a real app
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

export interface ActivityEvent {
  id: string;
  actor: string;
  action: ActivityAction;
  target: string;
  detail?: string;
  timestamp: string;
}

export interface StatusBreakdown {
  status: TaskStatus;
  count: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  read: boolean;
  timestamp: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
}