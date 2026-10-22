// src/models/appointment.model.ts
import prisma from "../db/prisma.js";
import type { Prisma, EstadoCita } from "../generated/prisma/client.js";


export function createAppointment(data: Prisma.CitaUncheckedCreateInput) {
  return prisma.cita.create({ data });
}

export function getDoctorAgenda(medicoId: number, from?: Date, to?: Date) {
  return prisma.cita.findMany({
    where: {
      medicoId,
      ...(from && to ? { fecha: { gte: from, lte: to } } : {}),
    },
    include: { paciente: true },
    orderBy: { fecha: "asc" },
  });
}

export function updateAppointmentStatus(id: number, estado: "COMPLETADA" | "CANCELADA") {
  return prisma.cita.update({
    where: { id },
    data: { estado },
  });
}

export function getAppointments(estado?: EstadoCita) {
  return prisma.cita.findMany({
    where: estado ? { estado } : {},
    include: { paciente: true, medico: true },
    orderBy: { fecha: "asc" },
  });
}
