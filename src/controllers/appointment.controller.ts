// src/controllers/appointment.controller.ts
import type { Request, Response } from "express";
import {
  createAppointment,
  getAppointments,
  getAppointmentsPaginated,
  getDoctorAgenda,
  updateAppointmentStatus,
} from "../models/appointment.model.js";
import { getPatientById } from "../models/patient.model.js";
import { getDoctorById } from "../models/doctor.model.js";
import { Prisma } from "../generated/prisma/client.js";
import type { EstadoCita } from "../generated/prisma/client.js";

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

const ESTADOS_VALIDOS: readonly string[] = ["PROGRAMADA", "COMPLETADA", "CANCELADA"];
const esEstadoCita = (valor: string): valor is EstadoCita => ESTADOS_VALIDOS.includes(valor);

export async function getAppointmentsController(req: Request, res: Response) {
  /*
    #swagger.tags = ['Citas']
    #swagger.summary = 'Listar citas (filtro por estado y paginación opcionales)'
    #swagger.parameters['estado'] = { in: 'query', description: 'Filtrar por estado', required: false, type: 'string', enum: ['PROGRAMADA', 'COMPLETADA', 'CANCELADA'] }
    #swagger.parameters['pagina'] = { in: 'query', description: 'Número de página (si se manda, la respuesta es paginada)', required: false, type: 'integer' }
    #swagger.parameters['limite'] = { in: 'query', description: 'Resultados por página (1 a 100, default 10)', required: false, type: 'integer' }
    #swagger.responses[200] = { description: "Array de citas con paciente y médico, o { data, total, pagina, totalPaginas } si se manda ?pagina" }
    #swagger.responses[400] = { description: "Estado inválido" }
    #swagger.responses[500] = { description: "Error al obtener las citas" }
  */
  try {
    let estado: EstadoCita | undefined;

    if (typeof req.query.estado === "string") {
      const valor = req.query.estado.toUpperCase();

      if (!esEstadoCita(valor)) {
        return res
          .status(400)
          .json({ error: "Estado inválido. Usá PROGRAMADA, COMPLETADA o CANCELADA" });
      }

      estado = valor; // acá TypeScript ya sabe que es un EstadoCita válido
    }

    // Con ?pagina → respuesta paginada { data, total, pagina, totalPaginas }
    if (req.query.pagina !== undefined) {
      const pagina = Math.max(1, Number(req.query.pagina) || 1);
      const limite = Math.min(100, Math.max(1, Number(req.query.limite) || 10));
      const resultado = await getAppointmentsPaginated(estado, pagina, limite);
      return res.status(200).json(resultado);
    }

    // Sin ?pagina → array plano, como antes
    const citas = await getAppointments(estado);
    res.status(200).json(citas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las citas" });
  }
}