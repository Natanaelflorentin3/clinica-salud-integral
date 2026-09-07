// src/swagger.ts
import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "API Clínica Salud Integral",
    description:
      "Documentación de la API para la gestión de pacientes, médicos, citas y reportes de la Clínica Salud Integral. Proyecto del curso FUNVAL.",
    version: "1.0.0",
  },
  servers: [{ url: "http://localhost:4000", description: "Servidor local" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Pegá tu token acá.",
      },
    },
  },
  security: [{ bearerAuth: [] }],
  tags: [
    { name: "Auth", description: "Registro e inicio de sesión (sin token)" },
    { name: "Pacientes", description: "Módulo de Recepción — expediente de pacientes" },
    { name: "Médicos", description: "Directorio y agenda de médicos" },
    { name: "Citas", description: "Agendamiento y atención de citas" },
    { name: "Reportes", description: "Reportes de gerencia" },
  ],
};

const outputFile = "./src/swagger-output.json";
const endpointsFiles = ["./src/app.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
