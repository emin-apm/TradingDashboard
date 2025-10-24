import { Request, Response, NextFunction } from "express";

type CustomError = Error & {
  status?: number;
  statusCode?: number;
};

export function errorHandler(
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("Global Error:", err);

  const statusCode =
    typeof err.status === "number"
      ? err.status
      : typeof err.statusCode === "number"
      ? err.statusCode
      : 500;

  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
  });
}
