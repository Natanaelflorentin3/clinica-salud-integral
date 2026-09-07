import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import patientRoutes from "./routes/patient.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import authRoutes from "./routes/auth.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import reportsRoutes from "./routes/reports.routes.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const swaggerFile = JSON.parse(
  readFileSync(join(__dirname, "swagger-output.json"), "utf-8")
);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// en app.ts, después de app.use(express.json())
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/appointments", appointmentRoutes);
app.get("/", (req, res) => {
  res.json({ message: "API Clínica Salud Integral funcionando" });
});

export default app;