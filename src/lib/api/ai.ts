import { TaskPriority } from "@/types";
import { api } from "@/lib/api";

export interface AITaskSuggestion {
  title: string;
  priority: TaskPriority;
  dueDate: string;
}

export async function generateTaskSuggestions(
  projectId: string,
  count?: number
): Promise<AITaskSuggestion[]> {
  return api.post<AITaskSuggestion[]>("/api/ai/tasks/generate", { projectId, count });
}