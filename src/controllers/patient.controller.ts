// src/controllers/patient.controller.ts
import type { Request, Response } from "express";
import {
  createPatient,
  deletePatient,
  getAllPatients,
  getPatientById,
  searchPatients,
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
    #swagger.summary = 'Listar pacientes (con búsqueda y paginación opcionales)'
    #swagger.parameters['query'] = { in: 'query', description: 'Buscar por nombre, apellido o email', required: false, type: 'string' }
    #swagger.parameters['pagina'] = { in: 'query', description: 'Número de página (si se manda, la respuesta es paginada)', required: false, type: 'integer' }
    #swagger.parameters['limite'] = { in: 'query', description: 'Resultados por página (1 a 100, default 10)', required: false, type: 'integer' }
    #swagger.responses[200] = { description: "Array de pacientes, o { data, total, pagina, totalPaginas } si se manda ?pagina" }
    #swagger.responses[500] = { description: "Error al obtener los pacientes" }
  */
  try {
    const query =
      typeof req.query.query === "string" && req.query.query.trim() !== ""
        ? req.query.query.trim()
        : undefined;

    // Con ?pagina → respuesta paginada { data, total, pagina, totalPaginas }
    if (req.query.pagina !== undefined) {
      const pagina = Math.max(1, Number(req.query.pagina) || 1);
      const limite = Math.min(100, Math.max(1, Number(req.query.limite) || 10));
      const resultado = await searchPatients(query, pagina, limite);
      return res.status(200).json(resultado);
    }

    // Sin ?pagina → array plano, como antes (no rompe a quien ya lo usa)
    const pacientes = await getAllPatients(query);
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
