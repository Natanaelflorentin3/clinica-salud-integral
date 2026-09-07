// src/controllers/reports.controller.ts
import type { Request, Response } from "express";
import { getAppointmentsBySpecialty, getDailyCutoff } from "../models/reports.model.js";

export async function getAppointmentsBySpecialtyController(req: Request, res: Response) {
  /*
    #swagger.tags = ['Reportes']
    #swagger.summary = 'Rentabilidad por especialidad'
    #swagger.responses[200] = {
      description: "Total de citas agrupado por especialidad",
      content: { "application/json": { schema: { type: "array", items: { type: "object", properties: { especialidad: { type: "string" }, total_citas: { type: "integer" } } } } } }
    }
    #swagger.responses[500] = { description: "Error al generar el reporte por especialidad" }
  */
  try {
    const reporte = await getAppointmentsBySpecialty();
    res.status(200).json(reporte);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al generar el reporte por especialidad" });
  }
}

export async function getDailyCutoffController(req: Request, res: Response) {
  /*
    #swagger.tags = ['Reportes']
    #swagger.summary = 'Corte operativo diario'
    #swagger.description = 'Cuenta solo las citas en estado COMPLETADA o CANCELADA del día indicado.'
    #swagger.parameters['date'] = { in: 'query', description: 'Fecha (YYYY-MM-DD)', required: true, type: 'string', example: '2026-12-01' }
    #swagger.responses[200] = {
      description: "Total de citas COMPLETADA/CANCELADA agrupado por estado",
      content: { "application/json": { schema: { type: "array", items: { type: "object", properties: { estado: { type: "string" }, _count: { type: "object", properties: { estado: { type: "integer" } } } } } } } }
    }
    #swagger.responses[500] = { description: "Error al generar el corte operativo diario" }
  */
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
