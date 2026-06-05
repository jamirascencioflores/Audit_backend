// src/modules/sedes/sede.controller.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const crearSede = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, direccion } = req.body;
    const usuario = (req as any).usuario;

    if (!usuario.id_empresa) {
      res
        .status(403)
        .json({
          error:
            "Operación no permitida. El usuario no tiene una empresa asignada.",
        });
      return;
    }

    const nuevaSede = await prisma.sede.create({
      data: {
        id_empresa: usuario.id_empresa,
        nombre,
        direccion,
      },
    });

    res.status(201).json({ mensaje: "Sede creada con éxito", sede: nuevaSede });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la sede" });
  }
};

export const obtenerSedes = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const usuario = (req as any).usuario;

    if (!usuario.id_empresa) {
      res.status(403).json({ error: "Operación no permitida." });
      return;
    }

    const sedes = await prisma.sede.findMany({
      where: { id_empresa: usuario.id_empresa },
      orderBy: { id_sede: "asc" },
    });

    res.json(sedes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las sedes" });
  }
};
