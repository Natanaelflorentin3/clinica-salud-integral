// src/models/doctor.model.ts
import prisma from "../db/prisma.js";
import type {  EspecialidadMedica } from "../generated/prisma/client.js";


export function getAllDoctors(especialidad?: EspecialidadMedica) {
  if (especialidad) {
    return prisma.medico.findMany({ where: { especialidadMedica: especialidad } });
  }
  return prisma.medico.findMany();
}
export function getDoctorById(id: number) {
  return prisma.medico.findUnique({ where: { id } });
  

}