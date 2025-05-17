import { Request, Response, NextFunction } from "express";

export function errorHandler(
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("Error:", error);
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  res.status(statusCode).json({ message });
}
