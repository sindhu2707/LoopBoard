import { Router } from "express"; 
import { getAllTeamMembers, getTeamMemberById, createTeamMember, updateTeamMember, deleteTeamMember } from "../data/store"; 
import { createTeamMemberSchema, updateTeamMemberSchema } from "../schemas/teamMember";
import { asyncHandler } from "../middleware/asyncHandler";
import { NotFoundError, ValidationError } from "../errors/AppError";

const router = Router(); router.get("/", (req, res) => { 
    res.json(getAllTeamMembers()); 
}); 

router.get("/:id", asyncHandler(async (req, res) => {
    const member = getTeamMemberById(String(req.params.id));

    if (!member) {
        throw new NotFoundError("Team member not found");
    }

    res.json(member);
}));
 
router.post("/", asyncHandler(async (req, res) => {
    const result = createTeamMemberSchema.safeParse(req.body);

    if (!result.success) {
        throw new ValidationError(
            "Invalid team member data",
            result.error.issues
        );
    }

    const newMember = createTeamMember(result.data);

    res.status(201).json(newMember);
}));

router.patch("/:id", asyncHandler(async (req, res) => {
    const result = updateTeamMemberSchema.safeParse(req.body);

    if (!result.success) {
        throw new ValidationError(
            "Invalid team member data",
            result.error.issues
        );
    }

    const member = updateTeamMember(
        String(req.params.id),
        result.data
    );

    if (!member) {
        throw new NotFoundError("Team member not found");
    }

    res.json(member);
}));

router.delete("/:id", asyncHandler(async (req, res) => {
    const deleted = deleteTeamMember(String(req.params.id));

    if (!deleted) {
        throw new NotFoundError("Team member not found");
    }

    res.status(204).send();
}));

export default router;