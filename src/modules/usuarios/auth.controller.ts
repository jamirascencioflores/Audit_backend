// src/modules/usuarios/auth.controller.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../config/db";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { correo, password } = req.body;

    // 1. Buscar al usuario por correo
    const usuario = await prisma.usuario.findUnique({
      where: { correo },
    });

    // 2. Validar credenciales (Flujo de retorno rojo en tu diagrama)
    if (!usuario || !(await bcrypt.compare(password, usuario.password_hash))) {
      res.status(401).json({ error: "Credenciales inválidas" });
      return;
    }

    // 3. Validar estado (Opcional según tu lógica de negocio)
    if (usuario.estado !== "ACTIVO") {
      res.status(403).json({ error: "Usuario inactivo o bloqueado" });
      return;
    }

    // 4. Generar el Token JWT (Flujo verde en tu diagrama)
    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        id_rol: usuario.id_rol,
        id_empresa: usuario.id_empresa,
      },
      process.env.JWT_SECRET || "secreto_desarrollo",
      { expiresIn: "24h" },
    );

    // 5. Devolver datos para el Dashboard
    res.json({
      mensaje: "Sesión activa detectada",
      token,
      usuario: {
        nombres: usuario.nombres,
        rol: usuario.id_rol,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
