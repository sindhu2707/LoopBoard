import { z } from "zod"; 

export const createProjectSchema = z.object({ 
    name: z.string().min(1, "Name is required"), 
    description: z.string().min(1, "Description is required"), 
    status: z.enum(["on-track", "at-risk", "delayed", "completed"]), 
    progress: z.number().min(0).max(100), 
    members: z.array(z.string()), 
    dueDate: z.string().min(1, "dueDate is required"), 
}); 

export const updateProjectSchema = createProjectSchema.partial(); 