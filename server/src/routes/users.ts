import { Router } from "express"; 
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "../data/store"; 
import { createUserSchema, updateUserSchema } from "../schemas/user"; 
import { asyncHandler } from "../middleware/asyncHandler"; 
import { NotFoundError, ValidationError } from "../errors/AppError"; 
import { User } from "@shared/types";

function toSafeUser(user: User) { 
    const { password, ...safeUser } = user; 
    return safeUser; 
} 

const router = Router(); 

router.get("/", asyncHandler(async (req, res) => { 
    res.json(getAllUsers().map(toSafeUser)); 
})); 

router.get("/:id", asyncHandler(async (req, res) => { 
    const user = getUserById(String(req.params.id)); 
    if (!user) throw new NotFoundError("User not found"); 
    res.json(toSafeUser(user));
})); 

router.post("/", asyncHandler(async (req, res) => { 
    const result = createUserSchema.safeParse(req.body); 
    if (!result.success) throw new ValidationError("Invalid user data", result.error.issues); 
    const newUser = await createUser(result.data); 
    res.status(201).json(toSafeUser(newUser));
})); 

router.patch("/:id", asyncHandler(async (req, res) => { 
    const result = updateUserSchema.safeParse(req.body); 
    if (!result.success) throw new ValidationError("Invalid user data", result.error.issues); 
    const updated = await updateUser(String(req.params.id), result.data); 
    if (!updated) throw new NotFoundError("User not found"); 
    res.json(toSafeUser(updated));
})); 

router.delete("/:id", asyncHandler(async (req, res) => { 
    const success = deleteUser(String(req.params.id)); 
    if (!success) throw new NotFoundError("User not found"); 
    res.status(204).send(); 
})); 

export default router;