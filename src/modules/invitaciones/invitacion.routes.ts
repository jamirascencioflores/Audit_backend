import { Router } from "express";
import { crearInvitacion, aceptarInvitacion } from "./invitacion.controller"; // Importar
import { verificarToken } from "../../middlewares/auth.middleware";

const router = Router();

// Endpoint: POST /api/invitaciones (Protegido - Solo Auditor Admin)
router.post("/", verificarToken, crearInvitacion);

// Endpoint: POST /api/invitaciones/aceptar/:token (Público - Activación del invitado)
router.post("/aceptar/:token", aceptarInvitacion);

export default router;
