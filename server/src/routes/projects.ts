import { Router } from "express"; 
import { getAllProjects, getProjectById, createProject, updateProject, deleteProject } from "../data/store"; 
import { createProjectSchema, updateProjectSchema } from "../schemas/project";
import { asyncHandler } from "../middleware/asyncHandler";
import { NotFoundError, ValidationError } from "../errors/AppError";

const router = Router(); 
router.get("/", (req, res) => { 
    res.json(getAllProjects()); 
}); 

router.get("/:id", asyncHandler(async (req, res) => {
    const project = getProjectById(String(req.params.id));

    if (!project) {
        throw new NotFoundError("Project not found");
    }

    res.json(project);
}));

router.post("/", asyncHandler(async (req, res) => {
    const result = createProjectSchema.safeParse(req.body);

    if (!result.success) {
        throw new ValidationError(
            "Invalid project data",
            result.error.issues
        );
    }

    const newProject = createProject(result.data);

    res.status(201).json(newProject);
}));

router.patch("/:id", asyncHandler(async (req, res) => {
    const result = updateProjectSchema.safeParse(req.body);

    if (!result.success) {
        throw new ValidationError(
            "Invalid project data",
            result.error.issues
        );
    }

    const project = updateProject(
        String(req.params.id),
        result.data
    );

    if (!project) {
        throw new NotFoundError("Project not found");
    }

    res.json(project);
}));

router.delete("/:id", asyncHandler(async (req, res) => {
    const deleted = deleteProject(String(req.params.id));

    if (!deleted) {
        throw new NotFoundError("Project not found");
    }

    res.status(204).send();
}));

export default router; 