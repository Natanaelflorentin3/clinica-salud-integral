import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import patientRoutes from "./routes/patient.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import authRoutes from "./routes/auth.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import reportsRoutes from "./routes/reports.routes.js";
// Import directo del JSON: así viaja dentro del deploy de Vercel (readFileSync podía quedar afuera)
import swaggerFile from "./swagger-output.json" with { type: "json" };


const app = express();

// Orígenes permitidos: localhost en desarrollo + la URL de Vercel en producción.
// FRONTEND_URL puede tener varias separadas por coma.
const origenesPermitidos = (process.env.FRONTEND_URL ?? "http://localhost:5173")
  .split(",")
  .map((origen) => origen.trim());

app.use(cors({ origin: origenesPermitidos }));
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