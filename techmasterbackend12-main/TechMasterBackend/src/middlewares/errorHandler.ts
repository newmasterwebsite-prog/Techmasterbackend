import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/apiResponse";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Detailed logging in development environment
  if (process.env.NODE_ENV === "development") {
    console.error(`[Error] ${req.method} ${req.url} - Status: ${statusCode}`);
    console.error(err.stack || err);
  } else {
    // Basic log for production
    console.error(`[Error] ${req.method} ${req.url} - Status: ${statusCode} - ${message}`);
  }

  // Handle specific MongoDB errors if encountered
  if (err.name === "ValidationError") {
    ApiResponse.error(res, "Validation Error", 400, err.errors);
    return;
  }

  if (err.name === "CastError") {
    ApiResponse.error(res, `Invalid path format: ${err.path}`, 400);
    return;
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {}).join(", ");
    ApiResponse.error(res, `Duplicate field value entered: ${field}`, 400);
    return;
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    ApiResponse.error(res, "Invalid token. Please log in again.", 401);
    return;
  }

  if (err.name === "TokenExpiredError") {
    ApiResponse.error(res, "Your token has expired. Please log in again.", 401);
    return;
  }

  // General response
  ApiResponse.error(
    res,
    message,
    statusCode,
    process.env.NODE_ENV === "development" ? { stack: err.stack } : undefined
  );
};
