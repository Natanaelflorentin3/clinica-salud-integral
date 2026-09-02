// src/controllers/doctor.controller.ts
import type { Request, Response } from "express";
import {  getAllDoctors } from "../models/doctor.model.js";
import type { EspecialidadMedica } from "../generated/prisma/client.js";




export async function getAllDoctorsController(req: Request, res: Response) {
  try {
    const doctores = await getAllDoctors(req.query.specialty as EspecialidadMedica | undefined);
    res.status(200).json(doctores);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los doctores" });
  }
}

