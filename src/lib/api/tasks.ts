import { Task, TaskStatus, TaskPriority } from "@/types";
import { api } from "@/lib/api";

export interface CreateTaskInput {
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  assigneeId: string | null;
  dueDate: string;
}

export interface UpdateTaskInput {
  title?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string | null;
  dueDate?: string;
}

export async function fetchTasks(): Promise<Task[]> {
  return api.get<Task[]>("/api/tasks");
}

export async function fetchProjectTasks(projectId: string): Promise<Task[]> {
  const all = await fetchTasks();
  return all.filter((t) => t.projectId === projectId);
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  return api.post<Task>("/api/tasks", input);
}

export async function updateTask(taskId: string, input: UpdateTaskInput): Promise<Task> {
  return api.patch<Task>(`/api/tasks/${taskId}`, input);
}

export async function updateTaskStatus(taskId: string, status: TaskStatus): Promise<Task> {
  return updateTask(taskId, { status });
}

export async function deleteTask(taskId: string): Promise<void> {
  return api.delete<void>(`/api/tasks/${taskId}`);
}