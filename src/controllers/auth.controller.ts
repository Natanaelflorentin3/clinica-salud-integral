// src/controllers/auth.controller.ts
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../db/prisma.js";

export async function register(req: Request, res: Response) {
  /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Registrar un nuevo usuario'
    #swagger.security = []
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["email", "password", "role"],
            properties: {
              email: { type: "string", example: "recepcion@test.com" },
              password: { type: "string", example: "123456" },
              role: { type: "string", enum: ["RECEPCIONISTA", "MEDICO", "GERENCIA"], example: "RECEPCIONISTA" }
            }
          }
        }
      }
    }
    #swagger.responses[201] = { description: "Usuario creado (sin password)" }
    #swagger.responses[500] = { description: "Error al registrar el usuario" }
  */
  try {
    const { email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role },
      select: { id: true, email: true, role: true },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar el usuario" });
  }
}

export async function login(req: Request, res: Response) {
  /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Iniciar sesión'
    #swagger.security = []
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["email", "password"],
            properties: {
              email: { type: "string", example: "recepcion@test.com" },
              password: { type: "string", example: "123456" }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: "Login exitoso",
      content: { "application/json": { schema: { type: "object", properties: { token: { type: "string" } } } } }
    }
    #swagger.responses[401] = { description: "Credenciales inválidas" }
    #swagger.responses[500] = { description: "Error al iniciar sesión" }
  */
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "8h" }
    );

    res.json({ token });
  } catch {
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
}