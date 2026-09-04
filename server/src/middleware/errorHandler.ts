import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        ...(err instanceof Error && "details" in err
          ? { details: (err as any).details }
          : {}),
      },
    });
  }

  console.error(err);

  res.status(500).json({
    error: {
      message: "Something went wrong on the server",
    },
  });
}
