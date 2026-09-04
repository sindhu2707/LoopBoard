import { z } from "zod"; 

export const createTaskSchema = z.object({ 
    title: z.string().min(1, "Title is required"), 
    status: z.enum(["todo", "in-progress", "review", "done"]), 
    priority: z.enum(["low", "medium", "high"]), 
    projectId: z.string().min(1, "projectId is required"), 
    assignee: z.string().min(1, "Assignee is required"), 
    dueDate: z.string().min(1, "dueDate is required"), 
}); 
    
export const updateTaskSchema = createTaskSchema.partial(); 