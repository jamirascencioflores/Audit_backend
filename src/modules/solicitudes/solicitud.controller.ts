// src/modules/solicitudes/solicitud.controller.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

export const crearSolicitud = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      empresa_razon_social,
      empresa_ruc,
      empresa_direccion,
      empresa_telefono,
      empresa_correo,
      auditor_nombres,
      auditor_dni,
      auditor_correo,
      auditor_telefono,
    } = req.body;

    // 1. Validar si ya existe una solicitud en proceso
    const existeSolicitud = await prisma.solicitudRegistro.findFirst({
      where: {
        OR: [{ empresa_ruc }, { auditor_dni }],
      },
    });

    if (existeSolicitud) {
      res
        .status(400)
        .json({
          error: "Ya existe una solicitud en proceso con este RUC o DNI.",
        });
      return;
    }

    // 2. NUEVO: Validar si la empresa o usuario ya existen como clientes activos
    const empresaRegistrada = await prisma.empresa.findUnique({
      where: { ruc: empresa_ruc },
    });
    const usuarioRegistrado = await prisma.usuario.findUnique({
      where: { dni: auditor_dni },
    });

    if (empresaRegistrada || usuarioRegistrado) {
      res
        .status(400)
        .json({
          error:
            "La empresa o el auditor ya se encuentran registrados en el sistema.",
        });
      return;
    }

    // 3. Crear la solicitud... (el resto de tu código queda igual)
    const nuevaSolicitud = await prisma.solicitudRegistro.create({
      data: {
        empresa_razon_social,
        empresa_ruc,
        empresa_direccion,
        empresa_telefono,
        empresa_correo,
        auditor_nombres,
        auditor_dni,
        auditor_correo,
        auditor_telefono,
        estado: "PENDIENTE",
        ip_dispositivo: req.ip || req.socket.remoteAddress,
      },
    });

    res
      .status(201)
      .json({
        mensaje: "Solicitud enviada correctamente",
        solicitud: nuevaSolicitud,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno al registrar la solicitud" });
  }
};

export const obtenerSolicitudes = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const estado = req.query.estado as string; // Permite filtrar por ?estado=PENDIENTE
    const solicitudes = await prisma.solicitudRegistro.findMany({
      where: estado ? { estado } : undefined,
      orderBy: { fecha_registro: "desc" },
    });
    res.json(solicitudes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las solicitudes" });
  }
};

export const evaluarSolicitud = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { estado, id_usuario_soporte, comentarios } = req.body; // 'APROBADA' o 'RECHAZADA'

    let token_activacion = null;
    let fecha_exp_token = null;

    if (estado === "APROBADA") {
      token_activacion = crypto.randomBytes(32).toString("hex");
      fecha_exp_token = new Date();
      fecha_exp_token.setDate(fecha_exp_token.getDate() + 3); // Vigencia de 3 días según Flujo 3
    }

    // Transacción: Actualiza la solicitud y registra la acción en la bitácora simultáneamente
    const resultado = await prisma.$transaction(async (prismaTx) => {
      const solicitudActualizada = await prismaTx.solicitudRegistro.update({
        where: { id_solicitud: Number(id) },
        data: {
          estado,
          token_activacion,
          fecha_exp_token,
        },
      });

      await prismaTx.bitacoraSoporte.create({
        data: {
          id_solicitud: Number(id),
          id_usuario_soporte: Number(id_usuario_soporte),
          tipo_interaccion: "Cambio Estado",
          comentarios:
            comentarios || `La solicitud fue ${estado.toLowerCase()}`,
        },
      });

      return solicitudActualizada;
    });

    // TODO: Integración con servicio de correos (ej. Nodemailer) para enviar el token al usuario.

    res.json({
      mensaje: `Solicitud ${estado.toLowerCase()} correctamente`,
      solicitud: resultado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al evaluar la solicitud" });
  }
};

export const activarCuenta = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const token = req.params.token as string;
    const {
      password,
      num_colegiatura,
      colegio_profesional,
      especialidad,
      anios_experiencia,
      pais,
      zona_horaria,
      idioma,
    } = req.body;

    // 1. Validar el token
    const solicitud = await prisma.solicitudRegistro.findFirst({
      where: { token_activacion: token, estado: "APROBADA" },
    });

    if (!solicitud) {
      res.status(400).json({ error: "Token inválido o ya utilizado." });
      return;
    }

    if (solicitud.fecha_exp_token && new Date() > solicitud.fecha_exp_token) {
      res.status(400).json({ error: "El enlace de activación ha expirado." });
      return;
    }

    // 2. Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 3. Transacción: Crear Empresa, Usuario y Perfil
    const resultado = await prisma.$transaction(async (prismaTx) => {
      const nuevaEmpresa = await prismaTx.empresa.create({
        data: {
          razon_social: solicitud.empresa_razon_social,
          ruc: solicitud.empresa_ruc,
          direccion: solicitud.empresa_direccion,
          telefono: solicitud.empresa_telefono,
          correo: solicitud.empresa_correo,
          estado: true,
        },
      });

      const nuevoUsuario = await prismaTx.usuario.create({
        data: {
          id_empresa: nuevaEmpresa.id_empresa,
          nombres: solicitud.auditor_nombres,
          dni: solicitud.auditor_dni,
          correo: solicitud.auditor_correo,
          telefono: solicitud.auditor_telefono,
          password_hash,
          id_rol: 1, // 1: Auditor Admin
          estado: "ACTIVO",
        },
      });

      await prismaTx.perfilProfesional.create({
        data: {
          id_usuario: nuevoUsuario.id_usuario,
          num_colegiatura,
          colegio_profesional,
          especialidad,
          anios_experiencia: Number(anios_experiencia),
          pais,
          zona_horaria,
          idioma,
        },
      });

      // 4. Inutilizar el token para que sea de un solo uso
      await prismaTx.solicitudRegistro.update({
        where: { id_solicitud: solicitud.id_solicitud },
        data: { token_activacion: null },
      });

      return {
        id_empresa: nuevaEmpresa.id_empresa,
        id_usuario: nuevoUsuario.id_usuario,
      };
    });

    res.status(201).json({
      mensaje: "Cuenta activada con éxito. Ya puedes iniciar sesión.",
      datos: resultado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al activar la cuenta" });
  }
};
