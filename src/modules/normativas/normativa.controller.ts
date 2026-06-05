// src/modules/normativas/normativa.controller.ts
import { Request, Response } from 'express';
import prisma from '../../config/db';

export const obtenerNormas = async (req: Request, res: Response): Promise<void> => {
  try {
    const normas = await prisma.norma.findMany({
      include: {
        requisitos: {
          include: {
            area: true
          }
        }
      }
    });

    res.json({ normas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el catálogo normativo' });
  }
};