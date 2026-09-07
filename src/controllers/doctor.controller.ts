// src/controllers/doctor.controller.ts
import type { Request, Response } from "express";
import {  getAllDoctors } from "../models/doctor.model.js";
import type { EspecialidadMedica } from "../generated/prisma/client.js";




export async function getAllDoctorsController(req: Request, res: Response) {
  /*
    #swagger.tags = ['Médicos']
    #swagger.summary = 'Listar médicos (directorio de solo lectura)'
    #swagger.parameters['specialty'] = {
      in: 'query',
      description: 'Filtrar por especialidad',
      required: false,
      type: 'string',
      enum: ['CARDIOLOGIA', 'PEDIATRIA', 'TRAUMATOLOGIA', 'DERMATOLOGIA', 'CLINICA_GENERAL']
    }
    #swagger.responses[200] = { description: "Array de médicos" }
    #swagger.responses[500] = { description: "Error al obtener los doctores" }
  */
  try {
    const doctores = await getAllDoctors(req.query.specialty as EspecialidadMedica | undefined);
    res.status(200).json(doctores);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los doctores" });
  }
}

