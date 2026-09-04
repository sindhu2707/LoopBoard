import { Router } from "express"; 
import { getAllTasks, getTaskById, createTask, updateTask, deleteTask } from "../data/store"; 
import { createTaskSchema, updateTaskSchema } from "../schemas/task"; 
import { asyncHandler } from "../middleware/asyncHandler"; 
import { NotFoundError, ValidationError } from "../errors/AppError";

const router = Router(); 

router.get("/", (req, res) => { 
    res.json(getAllTasks()); 
});

router.get("/:id", asyncHandler(async (req, res) => {
    const task = getTaskById(String(req.params.id));

    if (!task) {
        throw new NotFoundError("Task not found");
    }

    res.json(task);
}));

router.post("/", asyncHandler(async (req, res) => {
    const result = createTaskSchema.safeParse(req.body);

    if (!result.success) {
        throw new ValidationError(
            "Invalid task data",
            result.error.issues
        );
    }

    const newTask = createTask(result.data);

    res.status(201).json(newTask);
}));

router.patch("/:id", asyncHandler(async (req, res) => {
    const result = updateTaskSchema.safeParse(req.body);

    if (!result.success) {
        throw new ValidationError(
            "Invalid task data",
            result.error.issues
        );
    }

    const task = updateTask(
        String(req.params.id),
        result.data
    );

    if (!task) {
        throw new NotFoundError("Task not found");
    }

    res.json(task);
}));

router.delete("/:id", asyncHandler(async (req, res) => {
    const deleted = deleteTask(String(req.params.id));

    if (!deleted) {
        throw new NotFoundError("Task not found");
    }

    res.status(204).send();
}));

export default router;