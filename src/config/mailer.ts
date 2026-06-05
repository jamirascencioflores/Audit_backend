// src/config/mailer.ts
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // Usa una "Contraseña de aplicación" si es Gmail
  },
});

export const enviarCorreoInvitacion = async (correo: string, token: string) => {
  // Esta será la ruta de tu frontend (React/Next.js) que consumirá la API
  const enlaceInvitacion = `http://localhost:3000/registro-auditor?token=${token}`;

  await transporter.sendMail({
    from: `"Nos Planét Audit" <${process.env.SMTP_USER}>`,
    to: correo,
    subject: "Invitación al equipo de auditores - Nos Planét",
    html: `
      <h2>¡Has sido invitado!</h2>
      <p>Un administrador te ha invitado a unirte a su equipo de auditores.</p>
      <p>Haz clic en el enlace de abajo para configurar tu perfil profesional (caduca en 7 días):</p>
      <a href="${enlaceInvitacion}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Aceptar Invitación</a>
    `,
  });
};
