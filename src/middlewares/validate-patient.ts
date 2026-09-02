// src/middlewares/validate-patient.ts
import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

export const patientSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellido: z.string().min(1, "El apellido es obligatorio"),
  telefono: z.string().min(1, "El teléfono es obligatorio"),
  email: z.string().email("El correo no tiene un formato válido"),
  fechaNacimiento: z.coerce.date().max(new Date(), "La fecha de nacimiento no puede ser futura"),
});

export function validatePatient(req: Request, res: Response, next: NextFunction) {
  const result = patientSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error.issues });
  }

  req.body = result.data; // reemplaza el body por la versión ya validada/convertida (ej: fechaNacimiento como Date real, no string)
  next();
}