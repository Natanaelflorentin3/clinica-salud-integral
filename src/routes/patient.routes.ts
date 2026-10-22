// src/routes/patient.routes.ts
import { Router } from "express";
import {
  createPatientController,
  deletePatientController,
  getAllPatientsController,
  getPatientByIdController,
  updatePatientController,
} from "../controllers/patient.controller.js";
import { validatePatient, validatePatientUpdate } from "../middlewares/validate-patient.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

router.post("/", verifyToken, authorize("RECEPCIONISTA"), validatePatient, createPatientController);
router.get("/", verifyToken, authorize("RECEPCIONISTA"), getAllPatientsController);
router.get("/:id", verifyToken, authorize("RECEPCIONISTA"), getPatientByIdController);
router.put("/:id", verifyToken, authorize("RECEPCIONISTA"), validatePatientUpdate, updatePatientController);
router.delete("/:id", verifyToken, authorize("RECEPCIONISTA"), deletePatientController);

export default router;