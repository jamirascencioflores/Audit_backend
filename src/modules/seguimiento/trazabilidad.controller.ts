// src/modules/seguimiento/trazabilidad.controller.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const obtenerTrazabilidad = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id_auditoria } = req.params;

    const historial = await prisma.auditoriaTrazabilidad.findMany({
      where: { id_auditoria: Number(id_auditoria) },
      include: {
        usuario: { select: { nombres: true, correo: true, id_rol: true } },
      },
      orderBy: { fecha_accion: "asc" }, // Orden cronológico
    });

    res.json(historial);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener la trazabilidad" });
  }
};
