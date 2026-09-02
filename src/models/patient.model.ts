// src/models/patient.model.ts
import prisma from "../db/prisma.js";
import type { Prisma } from "../generated/prisma/client.js";

export function createPatient(data: Prisma.PacienteCreateInput) {
  return prisma.paciente.create({ data });
}

export function getAllPatients() {
  return prisma.paciente.findMany();
}

export function getPatientById(id: number) {
  return prisma.paciente.findUnique({ where: { id } });

}