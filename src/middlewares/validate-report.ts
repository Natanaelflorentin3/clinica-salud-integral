// src/middlewares/validate-report.ts
import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

export const dailyCutoffQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "El parámetro date debe tener el formato YYYY-MM-DD"),
});

export function validateDailyCutoffQuery(req: Request, res: Response, next: NextFunction) {
  const result = dailyCutoffQuerySchema.safeParse(req.query);

  if (!result.success) {
    return res.status(400).json({ error: result.error.issues });
  }

  next();
}