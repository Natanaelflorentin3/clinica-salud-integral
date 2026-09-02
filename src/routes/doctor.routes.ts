// src/routes/doctor.routes.ts
import { Router } from "express";
import { getAllDoctorsController } from "../controllers/doctor.controller.js";

const router = Router();

router.get("/", getAllDoctorsController);

export default router;