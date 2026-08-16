import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";
import { sendError } from "../utils/response.js";
import { logger } from "../config/logger.js";
import { env } from "../config/env.js";

export function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error({
    err,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  }, "Unhandled exception occurred");

  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  // Zod Validation Error Handling
  if (err.name === "ZodError") {
    sendError(res, "Validation Error", 400, err.errors);
    return;
  }

  // JWT Error Handling
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    sendError(res, "Invalid or expired authentication token. Please log in again.", 401);
    return;
  }

  const message = env.NODE_ENV === "production" 
    ? "Internal Server Error" 
    : err.message || "An unexpected error occurred";

  sendError(res, message, 500, env.NODE_ENV === "development" ? err.stack : null);
}
