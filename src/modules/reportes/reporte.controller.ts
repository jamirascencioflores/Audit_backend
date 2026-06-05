import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const obtenerMetricasDashboard = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id_empresa } = (req as any).usuario;

    // 1. Conteo de auditorías por estado
    const auditorias = await prisma.auditoria.groupBy({
      by: ["estado"],
      where: { id_empresa },
      _count: { estado: true },
    });

    // 2. Conteo de acciones correctivas por estado
    const acciones = await prisma.accionCorrectiva.groupBy({
      by: ["estado"],
      where: {
        hallazgo: {
          evaluacion: {
            auditoria: { id_empresa },
          },
        },
      },
      _count: { estado: true },
    });

    res.json({
      auditorias,
      acciones,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las métricas" });
  }
};
