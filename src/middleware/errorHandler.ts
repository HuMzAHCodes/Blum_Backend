import { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/errors.js";

/**
 * ── Global Express Error Handler Middleware ───────────────────
 * Intercepts all errors thrown in routes or controllers,
 * formats them consistently, and sends the response.
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const message = error.message || "Internal Server Error";

  // Log error stack for debugging
  console.error(`[Error Handler] [${req.method} ${req.url}] -`, error);

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
    // Include stack trace in response only during development
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
};
