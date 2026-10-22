// src/controllers/patient.controller.ts
import type { Request, Response } from "express";
import {
  createPatient,
  deletePatient,
  getAllPatients,
  getPatientById,
  updatePatient,
} from "../models/patient.model.js";
import { Prisma } from "../generated/prisma/client.js";

export async function createPatientController(req: Request, res: Response) {
  /*
    #swagger.tags = ['Pacientes']
    #swagger.summary = 'Crear un nuevo paciente'
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["nombre", "apellido", "telefono", "email", "fechaNacimiento"],
            properties: {
              nombre: { type: "string", example: "Juan" },
              apellido: { type: "string", example: "Pérez" },
              telefono: { type: "string", example: "3811234567" },
              email: { type: "string", example: "juan.perez@mail.com" },
              fechaNacimiento: { type: "string", format: "date", example: "1990-05-14" }
            }
          }
        }
      }
    }
    #swagger.responses[201] = { description: "Paciente creado" }
    #swagger.responses[500] = { description: "Error al crear el paciente" }
  */
  try {
    const paciente = await createPatient(req.body);
    res.status(201).json(paciente);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el paciente" });
  }
}


export async function getAllPatientsController(req: Request, res: Response) {
  /*
    #swagger.tags = ['Pacientes']
    #swagger.summary = 'Listar todos los pacientes'
    #swagger.responses[200] = { description: "Array de pacientes" }
    #swagger.responses[500] = { description: "Error al obtener los pacientes" }
  */
  try {
    const pacientes = await getAllPatients();
    res.status(200).json(pacientes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los pacientes" });
  }
}


export async function getPatientByIdController(req: Request, res: Response) {
  /*
    #swagger.tags = ['Pacientes']
    #swagger.summary = 'Expediente completo del paciente (con historial de citas)'
    #swagger.parameters['id'] = { in: 'path', description: 'ID del paciente', required: true, type: 'integer' }
    #swagger.responses[200] = { description: "Paciente con su array de citas (vacío si no tiene ninguna)" }
    #swagger.responses[404] = { description: "Paciente no encontrado" }
    #swagger.responses[500] = { description: "Error al obtener el paciente" }
  */
  try {
    const paciente = await getPatientById(Number(req.params.id));

    if (!paciente) {
      return res.status(404).json({ error: "Paciente no encontrado" });
    }

    res.status(200).json(paciente);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el paciente" });
  }
}

export async function updatePatientController(req: Request, res: Response) {
  /*
    #swagger.tags = ['Pacientes']
    #swagger.summary = 'Actualizar los datos de un paciente'
    #swagger.parameters['id'] = { in: 'path', description: 'ID del paciente', required: true, type: 'integer' }
    #swagger.responses[200] = { description: "Paciente actualizado" }
    #swagger.responses[404] = { description: "Paciente no encontrado" }
    #swagger.responses[409] = { description: "El email ya está registrado" }
    #swagger.responses[500] = { description: "Error al actualizar el paciente" }
  */
  try {
    const paciente = await updatePatient(Number(req.params.id), req.body);
    res.status(200).json(paciente);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Paciente no encontrado" });
      }
      if (error.code === "P2002") {
        return res.status(409).json({ error: "Ya existe un paciente con ese email" });
      }
    }
    res.status(500).json({ error: "Error al actualizar el paciente" });
  }
}

export async function deletePatientController(req: Request, res: Response) {
  /*
    #swagger.tags = ['Pacientes']
    #swagger.summary = 'Eliminar un paciente'
    #swagger.parameters['id'] = { in: 'path', description: 'ID del paciente', required: true, type: 'integer' }
    #swagger.responses[204] = { description: "Paciente eliminado" }
    #swagger.responses[404] = { description: "Paciente no encontrado" }
    #swagger.responses[409] = { description: "El paciente tiene citas asociadas" }
    #swagger.responses[500] = { description: "Error al eliminar el paciente" }
  */
  try {
    await deletePatient(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Paciente no encontrado" });
      }
      // P2003: violación de clave foránea → el paciente tiene citas
      if (error.code === "P2003") {
        return res
          .status(409)
          .json({ error: "No se puede eliminar: el paciente tiene citas registradas" });
      }
    }
    res.status(500).json({ error: "Error al eliminar el paciente" });
  }
}
