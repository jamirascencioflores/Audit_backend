// src/modules/invitaciones/invitacion.controller.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { enviarCorreoInvitacion } from "../../config/mailer";

const prisma = new PrismaClient();

export const crearInvitacion = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { correo_invitado } = req.body;

    // Obtenemos los datos del Auditor Admin desde el token (inyectado por el middleware)
    const usuarioAdmin = (req as any).usuario;

    // Validación de seguridad: Solo el Auditor Admin (rol 1) puede invitar
    if (usuarioAdmin.id_rol !== 1) {
      res.status(403).json({
        error: "Solo los administradores pueden enviar invitaciones.",
      });
      return;
    }

    // 1. Validar que el correo no pertenezca a un usuario ya registrado
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { correo: correo_invitado },
    });

    if (usuarioExistente) {
      res
        .status(400)
        .json({ error: "El usuario ya está registrado en el sistema." });
      return;
    }

    // 2. Validar que no exista una invitación pendiente para ese correo
    const invitacionPendiente = await prisma.invitacionAuditor.findFirst({
      where: {
        correo_invitado,
        estado: { in: ["PENDIENTE", "ENVIADA"] },
      },
    });

    if (invitacionPendiente) {
      res.status(400).json({
        error: "Ya existe una invitación pendiente para este correo.",
      });
      return;
    }

    // 3. Generar token y fechas
    const token = crypto.randomBytes(32).toString("hex");
    const fecha_expiracion = new Date();
    fecha_expiracion.setDate(fecha_expiracion.getDate() + 7); // La invitación dura 7 días

    // 4. Crear el registro en la base de datos
    const nuevaInvitacion = await prisma.invitacionAuditor.create({
      data: {
        id_empresa: usuarioAdmin.id_empresa,
        id_usuario_admin: usuarioAdmin.id_usuario,
        correo_invitado,
        token,
        fecha_expiracion,
        estado: "PENDIENTE",
      },
    });

    // Enviar correo de invitación
    await enviarCorreoInvitacion(nuevaInvitacion.correo_invitado, nuevaInvitacion.token);

    res.status(201).json({
      mensaje: "Invitación generada correctamente",
      invitacion: nuevaInvitacion,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al generar la invitación" });
  }
};

export const aceptarInvitacion = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { token } = req.params;
    const {
      nombres,
      dni,
      telefono,
      password,
      num_colegiatura,
      colegio_profesional,
      especialidad,
      anios_experiencia,
      pais,
      zona_horaria,
      idioma,
    } = req.body;

    // 1. Validar la invitación
    const invitacion = await prisma.invitacionAuditor.findFirst({
      where: { token: token as string, estado: "PENDIENTE" },
    });

    if (!invitacion) {
      res
        .status(400)
        .json({ error: "Enlace inválido o invitación ya utilizada." });
      return;
    }

    if (new Date() > invitacion.fecha_expiracion) {
      res.status(400).json({ error: "La invitación ha expirado." });
      return;
    }

    // 2. Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 3. Transacción: Crear Usuario (Rol 2), Perfil y Actualizar Invitación
    const resultado = await prisma.$transaction(async (prismaTx) => {
      const nuevoUsuario = await prismaTx.usuario.create({
        data: {
          id_empresa: invitacion.id_empresa, // Se vincula automáticamente a la empresa
          nombres,
          dni,
          correo: invitacion.correo_invitado, // El correo no se puede cambiar
          telefono,
          password_hash,
          id_rol: 2, // 2: Auditor Regular
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

      await prismaTx.invitacionAuditor.update({
        where: { id_invitacion: invitacion.id_invitacion },
        data: { estado: "ACEPTADA" },
      });

      return {
        id_usuario: nuevoUsuario.id_usuario,
        id_empresa: invitacion.id_empresa,
      };
    });

    res.status(201).json({
      mensaje: "Cuenta creada con éxito. Bienvenido al equipo.",
      datos: resultado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar la cuenta del auditor" });
  }
};
