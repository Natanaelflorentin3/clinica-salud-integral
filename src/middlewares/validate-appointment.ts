// src/middlewares/validate-appointment.ts
import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

export const appointmentSchema = z.object({
  pacienteId: z.number().int().positive(),
  medicoId: z.number().int().positive(),
  fecha: z.coerce.date().min(new Date(), "No puedes agendar una cita en una fecha que ya pasó"),
});

export function validateAppointment(req: Request, res: Response, next: NextFunction) {
  const result = appointmentSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error.issues });
  }

  req.body = result.data;
  next();
}

export const appointmentStatusSchema = z.object({
  estado: z.enum(["COMPLETADA", "CANCELADA"]),
});

export function validateAppointmentStatus(req: Request, res: Response, next: NextFunction) {
  const result = appointmentStatusSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error.issues });
  }

  req.body = result.data;
  next();
}