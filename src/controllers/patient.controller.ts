// src/controllers/patient.controller.ts
import type { Request, Response } from "express";
import { createPatient, getAllPatients, getPatientById } from "../models/patient.model.js";

export async function createPatientController(req: Request, res: Response) {
  try {
    const paciente = await createPatient(req.body);
    res.status(201).json(paciente);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el paciente" });
  }
}


export async function getAllPatientsController(req: Request, res: Response) {
  try {
    const pacientes = await getAllPatients();
    res.status(200).json(pacientes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los pacientes" });
  }
}


export async function getPatientByIdController(req: Request, res: Response) {
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