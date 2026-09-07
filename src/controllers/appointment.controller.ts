// src/controllers/appointment.controller.ts
import type { Request, Response } from "express";
import {
  createAppointment,
  getDoctorAgenda,
  updateAppointmentStatus,
} from "../models/appointment.model.js";
import { getPatientById } from "../models/patient.model.js";
import { getDoctorById } from "../models/doctor.model.js";
import { Prisma } from "../generated/prisma/client.js";

export async function createAppointmentController(req: Request, res: Response) {
  /*
    #swagger.tags = ['Citas']
    #swagger.summary = 'Agendar una nueva cita'
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["pacienteId", "medicoId", "fecha"],
            properties: {
              pacienteId: { type: "integer", example: 1 },
              medicoId: { type: "integer", example: 1 },
              fecha: { type: "string", format: "date", example: "2026-12-01" }
            }
          }
        }
      }
    }
    #swagger.responses[201] = { description: "Cita creada con estado PROGRAMADA" }
    #swagger.responses[400] = { description: "Fecha en el pasado" }
    #swagger.responses[404] = { description: "Paciente o médico no encontrado" }
    #swagger.responses[500] = { description: "Error al agendar la cita" }
  */
  try {
    const { pacienteId, medicoId } = req.body;

    const paciente = await getPatientById(pacienteId);
    if (!paciente) {
      return res.status(404).json({ error: "Paciente no encontrado" });
    }

    const medico = await getDoctorById(medicoId);
    if (!medico) {
      return res.status(404).json({ error: "Médico no encontrado" });
    }

    const cita = await createAppointment(req.body);
    res.status(201).json(cita);
  } catch (error) {
    res.status(500).json({ error: "Error al agendar la cita" });
  }
}

export async function getDoctorAgendaController(req: Request, res: Response) {
  /*
    #swagger.tags = ['Médicos']
    #swagger.summary = 'Agenda del médico por rango de fechas'
    #swagger.parameters['id'] = { in: 'path', description: 'ID del médico', required: true, type: 'integer' }
    #swagger.parameters['from'] = { in: 'query', description: 'Fecha desde (YYYY-MM-DD)', required: false, type: 'string', example: '2026-11-01' }
    #swagger.parameters['to'] = { in: 'query', description: 'Fecha hasta (YYYY-MM-DD)', required: false, type: 'string', example: '2026-12-31' }
    #swagger.responses[200] = { description: "Array de citas del médico en el rango, con los datos del paciente de cada una" }
    #swagger.responses[500] = { description: "Error al obtener la agenda del médico" }
  */
  try {
    const medicoId = Number(req.params.id);
    const { from, to } = req.query;

    const desde = from && to ? new Date(from as string) : undefined;
    const hasta = from && to ? new Date(to as string) : undefined;

    const agenda = await getDoctorAgenda(medicoId, desde, hasta);
    res.status(200).json(agenda);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la agenda del médico" });
  }
}

export async function updateAppointmentStatusController(req: Request, res: Response) {
  /*
    #swagger.tags = ['Citas']
    #swagger.summary = 'Cambiar el estado de una cita'
    #swagger.parameters['id'] = { in: 'path', description: 'ID de la cita', required: true, type: 'integer' }
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["estado"],
            properties: {
              estado: { type: "string", enum: ["COMPLETADA", "CANCELADA"], example: "COMPLETADA" }
            }
          }
        }
      }
    }
    #swagger.responses[200] = { description: "Cita actualizada" }
    #swagger.responses[404] = { description: "Cita no encontrada" }
    #swagger.responses[500] = { description: "Error al actualizar el estado de la cita" }
  */
  try {
    const id = Number(req.params.id);
    const { estado } = req.body;

    const cita = await updateAppointmentStatus(id, estado);
    res.status(200).json(cita);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return res.status(404).json({ error: "Cita no encontrada" });
    }
    res.status(500).json({ error: "Error al actualizar el estado de la cita" });
  }
}