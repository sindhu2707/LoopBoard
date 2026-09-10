import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt";
import { UnauthorizedError } from "../errors/AppError";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userName?: string;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token;
  if (!token) throw new UnauthorizedError("Not logged in");

  try {
    const payload = verifyToken(token);
    req.userId = payload.userId;
    req.userName = payload.name;
    next();
  } catch {
    throw new UnauthorizedError("Invalid or expired session");
  }
}