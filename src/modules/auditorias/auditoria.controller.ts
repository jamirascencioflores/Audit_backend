// src/modules/auditorias/auditoria.controller.ts
import { Request, Response } from "express";
import prisma from "../../config/db";

export const obtenerAuditorias = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // El middleware inyectó los datos decodificados en req.usuario
    const usuario = (req as any).usuario;

    const auditorias = await prisma.auditoria.findMany({
      where: { id_empresa: usuario.id_empresa },
      include: {
        sede: true,
        norma: true,
        area: true,
      },
    });

    res.json({ auditorias });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las auditorías" });
  }
};

export const crearAuditoria = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      id_norma,
      id_sede,
      id_area,
      fecha_programada,
      hora_inicio,
      duracion_estimada,
      alcance,
    } = req.body;
    const usuario = (req as any).usuario;

    const nuevaAuditoria = await prisma.auditoria.create({
      data: {
        id_empresa: usuario.id_empresa,
        id_sede,
        id_norma,
        id_area,
        fecha_programada: new Date(fecha_programada),
        // Las horas se manejan como Date en Prisma, pero solo extraerá el tiempo en la BD
        hora_inicio: new Date(`1970-01-01T${hora_inicio}Z`),
        duracion_estimada: new Date(`1970-01-01T${duracion_estimada}Z`),
        alcance,
        estado: "PENDIENTE",
        // Inserción anidada para el equipo
        equipo: {
          create: {
            id_usuario: usuario.id_usuario,
            rol: "Lider",
          },
        },
      },
      include: {
        equipo: true, // Para devolver los datos del equipo en la respuesta
      },
    });

    res.status(201).json({
      mensaje: "Auditoría programada con éxito",
      auditoria: nuevaAuditoria,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la auditoría" });
  }
};

export const obtenerChecklist = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    // 1. Obtener la norma y área de la auditoría solicitada
    const auditoria = await prisma.auditoria.findUnique({
      where: { id_auditoria: Number(id) },
      select: { id_norma: true, id_area: true },
    });

    if (!auditoria) {
      res.status(404).json({ error: "Auditoría no encontrada" });
      return;
    }

    // 2. Traer solo los requisitos exactos para ese cruce
    const checklist = await prisma.requisitoNorma.findMany({
      where: {
        id_norma: auditoria.id_norma,
        id_area: auditoria.id_area,
      },
    });

    res.json({ checklist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el checklist" });
  }
};

export const evaluarRequisito = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { id_requisito, clasificacion, criticidad, descripcion_hallazgo } =
      req.body;

    const evaluacion = await prisma.auditoriaEvaluacion.create({
      data: {
        id_auditoria: Number(id),
        id_requisito,
        clasificacion,
        fecha_evaluacion: new Date(),
        // Inserción anidada: Solo crea el hallazgo si es 'NC'
        ...(clasificacion === "NC" && {
          hallazgo: {
            create: {
              criticidad: criticidad || "Menor",
              descripcion: descripcion_hallazgo || "Sin descripción",
            },
          },
        }),
      },
      include: {
        hallazgo: true, // Devuelve los datos del hallazgo en la respuesta
      },
    });

    res
      .status(201)
      .json({ mensaje: "Evaluación registrada con éxito", evaluacion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al guardar la evaluación" });
  }
};

export const cambiarEstado = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { estado, comentario_final } = req.body; // Estados válidos: EN_PROCESO, PAUSADA, FINALIZADA

    const auditoriaActualizada = await prisma.auditoria.update({
      where: { id_auditoria: Number(id) },
      data: {
        estado,
        comentario_final,
      },
    });

    res.json({
      mensaje: `Auditoría marcada como ${estado}`,
      auditoria: auditoriaActualizada,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al cambiar el estado de la auditoría" });
  }
};

// Temporal para subir evidencias a local
export const subirEvidencia = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    console.log("--- DEBUG EVIDENCIA ---");
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Body devuelto por Multer:", req.body);
    console.log("File devuelto por Multer:", req.file);

    // 1. Validar primero si llegó el archivo (antes de leer el body)
    if (!req.file) {
      res
        .status(400)
        .json({
          error: 'No se recibió el archivo. Verifica el campo "archivo".',
        });
      return;
    }

    // 2. Extraer datos de forma segura
    const body = req.body || {};
    const { id_evaluacion, tipo, latitud, longitud } = body;

    if (!id_evaluacion) {
      res.status(400).json({ error: "Falta el campo id_evaluacion" });
      return;
    }

    const usuario = (req as any).usuario;
    const extension = req.file.mimetype.split("/")[0];
    const formato =
      extension === "image"
        ? "Foto"
        : extension === "video"
          ? "Video"
          : "Documento";

    const nuevaEvidencia = await prisma.evidencia.create({
      data: {
        id_evaluacion: Number(id_evaluacion),
        id_usuario_captura: usuario.id_usuario,
        tipo: tipo || "Fisica",
        formato,
        url_archivo: `/uploads/${req.file.filename}`,
        fecha_captura: new Date(),
        latitud: latitud ? Number(latitud) : null,
        longitud: longitud ? Number(longitud) : null,
      },
    });

    res
      .status(201)
      .json({
        mensaje: "Evidencia subida con éxito",
        evidencia: nuevaEvidencia,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno al guardar en BD" });
  }
};
