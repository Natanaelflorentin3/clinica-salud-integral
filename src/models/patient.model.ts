// src/models/patient.model.ts
import prisma from "../db/prisma.js";
import type { Prisma } from "../generated/prisma/client.js";

export function createPatient(data: Prisma.PacienteCreateInput) {
  return prisma.paciente.create({ data });
}

// Filtro de búsqueda: nombre, apellido o email que CONTENGAN el texto (sin importar mayúsculas)
function filtroBusqueda(query?: string): Prisma.PacienteWhereInput {
  if (!query) return {};
  return {
    OR: [
      { nombre: { contains: query, mode: "insensitive" } },
      { apellido: { contains: query, mode: "insensitive" } },
      { email: { contains: query, mode: "insensitive" } },
    ],
  };
}

export function getAllPatients(query?: string) {
  return prisma.paciente.findMany({ where: filtroBusqueda(query), orderBy: { id: "asc" } });
}

// Versión paginada: devuelve { data, total, pagina, totalPaginas }
export async function searchPatients(query: string | undefined, pagina: number, limite: number) {
  const where = filtroBusqueda(query);

  const [data, total] = await Promise.all([
    prisma.paciente.findMany({
      where,
      orderBy: { id: "asc" },
      skip: (pagina - 1) * limite,
      take: limite,
    }),
    prisma.paciente.count({ where }),
  ]);

  return { data, total, pagina, totalPaginas: Math.max(1, Math.ceil(total / limite)) };
}

export function getPatientById(id: number) {
  return prisma.paciente.findUnique({
    where: { id },
    include: {
      citas: {
        include: { medico: true },
        orderBy: { fecha: "desc" },
      },
    },
  });
}

export function updatePatient(id: number, data: Prisma.PacienteUpdateInput) {
  return prisma.paciente.update({ where: { id }, data });
}

export function deletePatient(id: number) {
  return prisma.paciente.delete({ where: { id } });
}
