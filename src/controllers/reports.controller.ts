// src/controllers/reports.controller.ts
import type { Request, Response } from "express";
import { getAppointmentsBySpecialty, getDailyCutoff } from "../models/reports.model.js";

export async function getAppointmentsBySpecialtyController(req: Request, res: Response) {
  try {
    const reporte = await getAppointmentsBySpecialty();
    res.status(200).json(reporte);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al generar el reporte por especialidad" });
  }
}

export async function getDailyCutoffController(req: Request, res: Response) {
  try {
    const date = req.query.date as string;
    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    const corte = await getDailyCutoff(startOfDay, endOfDay);
    res.status(200).json(corte);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al generar el corte operativo diario" });
  }
}
