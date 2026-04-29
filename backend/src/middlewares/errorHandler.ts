import { Request, Response, NextFunction } from "express";

type AppError = Error & {
  statusCode?: number;
  code?: string | number;
  duplicateFields?: string[];
  keyPattern?: Record<string, number>;
};

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("API Error:", err);

  if (err.code === 11000) {
    const duplicateFields = Object.keys(err.keyPattern || {});

    return res.status(409).json({
      success: false,
      code: "DUPLICATE_LEAD",
      message:
        duplicateFields.length > 1
          ? "A lead with these details already exists."
          : `A lead with this ${duplicateFields[0]} already exists.`,
      duplicateFields,
    });
  }

  return res.status(err.statusCode || 500).json({
    success: false,
    code: err.code || "INTERNAL_SERVER_ERROR",
    message: err.message || "Something went wrong",
    duplicateFields: err.duplicateFields || undefined,
  });
}

export const notFoundHandler = (_req: any, res: any) => {
  res.status(404).json({ success: false, message: "Route not found" });
}