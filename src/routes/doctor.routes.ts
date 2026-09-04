// src/routes/doctor.routes.ts
import { Router } from "express";
import { getAllDoctorsController } from "../controllers/doctor.controller.js";
import { getDoctorAgendaController } from "../controllers/appointment.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

router.get("/", verifyToken, authorize("RECEPCIONISTA"), getAllDoctorsController);
router.get("/:id/appointments", verifyToken, authorize("MEDICO"), getDoctorAgendaController);

export default router;