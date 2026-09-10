import { z } from "zod";

const isoDateString = z
  .string()
  .min(1, "dueDate is required")
  .refine((val) => !isNaN(Date.parse(val)), "dueDate must be a valid date");

export const createProjectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["on-track", "at-risk", "delayed", "completed"]),
  progress: z.number().min(0).max(100),
  memberIds: z.array(z.string().min(1)).optional(),
  dueDate: isoDateString,
});

export const updateProjectSchema = createProjectSchema.partial();
