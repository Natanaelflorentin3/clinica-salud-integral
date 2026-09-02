import express from "express";
import cors from "cors";
import patientRoutes from "./routes/patient.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";

const app = express();

app.use(cors());
app.use(express.json());


// en app.ts, después de app.use(express.json())
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.get("/", (req, res) => {
  res.json({ message: "API Clínica Salud Integral funcionando" });
});

export default app;