// src/models/reports.model.ts
import prisma from "../db/prisma.js";

export function getAppointmentsBySpecialty() {
  return prisma.$queryRaw`
    SELECT m.especialidad_medica AS especialidad, COUNT(c.id)::int AS total_citas
    FROM citas c
    INNER JOIN medicos m ON m.id = c.medico_id
    GROUP BY m.especialidad_medica
    ORDER BY total_citas DESC
  `;
}

export function getDailyCutoff(startOfDay: Date, endOfDay: Date) {
  return prisma.cita.groupBy({
    by: ["estado"],
    where: {
      fecha: { gte: startOfDay, lte: endOfDay },
      estado: { in: ["COMPLETADA", "CANCELADA"] },
    },
    _count: { estado: true },
  });
}