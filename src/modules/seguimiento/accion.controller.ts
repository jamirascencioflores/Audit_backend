// src/modules/seguimiento/accion.controller.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 1. Crear una Acción Correctiva para un hallazgo
export const crearAccion = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      id_hallazgo,
      id_usuario_responsable,
      descripcion_plan,
      plazo_resolucion,
    } = req.body;

    const nuevaAccion = await prisma.accionCorrectiva.create({
      data: {
        id_hallazgo: Number(id_hallazgo),
        id_usuario_responsable: Number(id_usuario_responsable),
        descripcion_plan,
        plazo_resolucion: new Date(plazo_resolucion),
        estado: "ABIERTA", // ABIERTA, EN_PROCESO, CERRADA
      },
    });

    res
      .status(201)
      .json({ mensaje: "Acción correctiva asignada", accion: nuevaAccion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la acción correctiva" });
  }
};

// 2. Obtener acciones de un usuario específico (Mis tareas)
export const obtenerMisAcciones = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const usuarioId = (req as any).usuario.id_usuario;

    const acciones = await prisma.accionCorrectiva.findMany({
      where: { id_usuario_responsable: usuarioId },
      include: {
        hallazgo: true, // Trae todo el objeto hallazgo para evitar errores de selección
      },
    });

    res.json(acciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las acciones" });
  }
};

// 3. Actualizar estado
export const actualizarEstadoAccion = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const accionActualizada = await prisma.accionCorrectiva.update({
      where: { id_accion: Number(id) },
      data: {
        estado, // EN_PROCESO, CERRADA
      },
    });

    res.json({
      mensaje: `Acción marcada como ${estado}`,
      accion: accionActualizada,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la acción" });
  }
};
