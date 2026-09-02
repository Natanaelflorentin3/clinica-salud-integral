// src/routes/patient.routes.ts
import { Router } from "express";
import {
  createPatientController,
  getAllPatientsController,
  getPatientByIdController,
} from "../controllers/patient.controller.js";
import { validatePatient } from "../middlewares/validate-patient.js";

const router = Router();

router.post("/", validatePatient, createPatientController);
router.get("/", getAllPatientsController);
router.get("/:id", getPatientByIdController);

export default router;