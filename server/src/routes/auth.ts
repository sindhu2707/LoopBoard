import { Router } from "express";
import bcrypt from "bcrypt";
import { createUser, getUserByEmail, getUserById } from "../data/store";
import { registerSchema, loginSchema } from "../schemas/auth";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAuth } from "../middleware/requireAuth";
import { ValidationError, UnauthorizedError } from "../errors/AppError";
import { signToken } from "../lib/jwt";
import { User } from "@shared/types";

function toSafeUser(user: User) {
  const { password, ...safeUser } = user;
  return safeUser;
}

const isProd = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? ("none" as const) : ("lax" as const),
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const router = Router();

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const result = registerSchema.safeParse(req.body);
    if (!result.success)
      throw new ValidationError("Invalid registration data", result.error.issues);

    const existing = await getUserByEmail(result.data.email);
    if (existing) throw new ValidationError("Email is already registered");

    const user = await createUser(result.data);
    const token = signToken({ userId: user.id, email: user.email, name: user.name });
    res.cookie("token", token, cookieOptions);
    res.status(201).json(toSafeUser(user));
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const result = loginSchema.safeParse(req.body);
    if (!result.success)
      throw new ValidationError("Invalid login data", result.error.issues);

    const user = await getUserByEmail(result.data.email);
    if (!user) throw new UnauthorizedError("Invalid email or password");

    const valid = await bcrypt.compare(result.data.password, user.password!);
    if (!valid) throw new UnauthorizedError("Invalid email or password");

    const token = signToken({ userId: user.id, email: user.email, name: user.name });
    res.cookie("token", token, cookieOptions);
    res.json(toSafeUser(user));
  })
);

router.post("/logout", (req, res) => {
  res.clearCookie("token", cookieOptions);
  res.status(204).send();
});

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await getUserById(req.userId!);
    if (!user) throw new UnauthorizedError("Session user no longer exists");
    res.json(toSafeUser(user));
  })
);

export default router;