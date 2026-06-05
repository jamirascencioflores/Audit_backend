// src/modules/perfiles/perfil.controller.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const obtenerMiPerfil = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const usuarioId = (req as any).usuario.id_usuario;

    const perfil = await prisma.usuario.findUnique({
      where: { id_usuario: usuarioId },
      select: {
        nombres: true,
        correo: true,
        telefono: true,
        id_rol: true,
        perfil: true,
        competencias: {
          include: { norma: true, area: true, sede: true },
        },
      },
    });

    res.json(perfil);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el perfil" });
  }
};

export const actualizarPerfil = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const usuarioId = (req as any).usuario.id_usuario;
    const { telefono, especialidad, anios_experiencia, idioma } = req.body;

    const perfilActualizado = await prisma.usuario.update({
      where: { id_usuario: usuarioId },
      data: {
        telefono,
        perfil: {
          update: {
            especialidad,
            anios_experiencia: anios_experiencia
              ? Number(anios_experiencia)
              : undefined,
            idioma,
          },
        },
      },
      select: {
        id_usuario: true,
        id_empresa: true,
        nombres: true,
        dni: true,
        correo: true,
        telefono: true,
        id_rol: true,
        estado: true,
        perfil: true,
      },
    });

    res.json({
      mensaje: "Perfil actualizado correctamente",
      datos: perfilActualizado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el perfil" });
  }
};
