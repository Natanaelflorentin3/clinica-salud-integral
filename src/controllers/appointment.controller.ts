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