// src/routes/appointment.routes.ts
import { Router } from "express";
import {
  createAppointmentController,
  getAppointmentsController,
  updateAppointmentStatusController,
} from "../controllers/appointment.controller.js";
import {
  validateAppointment,
  validateAppointmentStatus,
} from "../middlewares/validate-appointment.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

router.get(
  "/",
  verifyToken,
  authorize("RECEPCIONISTA", "MEDICO", "GERENCIA"),
  getAppointmentsController
);

router.post(
  "/",
  verifyToken,
  authorize("RECEPCIONISTA", "MEDICO"),
  validateAppointment,
  createAppointmentController
);

router.patch(
  "/:id/status",
  verifyToken,
  authorize("MEDICO"),
  validateAppointmentStatus,
  updateAppointmentStatusController
);

export default router;