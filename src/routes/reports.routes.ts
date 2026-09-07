// src/routes/reports.routes.ts
import { Router } from "express";
import {
  getAppointmentsBySpecialtyController,
  getDailyCutoffController,
} from "../controllers/reports.controller.js";
import { validateDailyCutoffQuery } from "../middlewares/validate-report.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

router.get("/appointments-by-specialty", verifyToken, authorize("GERENCIA"), getAppointmentsBySpecialtyController);
router.get("/daily-cutoff", verifyToken, authorize("GERENCIA"), validateDailyCutoffQuery, getDailyCutoffController);

export default router;