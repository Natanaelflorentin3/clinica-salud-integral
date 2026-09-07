// src/controllers/patient.controller.ts
import type { Request, Response } from "express";
import { createPatient, getAllPatients, getPatientById } from "../models/patient.model.js";

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