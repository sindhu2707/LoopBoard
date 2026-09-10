import { z } from "zod";

const isoDateString = z
  .string()
  .min(1, "dueDate is required")
  .refine((val) => !isNaN(Date.parse(val)), "dueDate must be a valid date");

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  status: z.enum(["todo", "in-progress", "review", "done"]),
  priority: z.enum(["low", "medium", "high"]),
  projectId: z.string().min(1, "projectId is required"),
  assigneeId: z.string().min(1).nullable().optional(),
  dueDate: isoDateString,
});

export const updateTaskSchema = createTaskSchema.partial();
