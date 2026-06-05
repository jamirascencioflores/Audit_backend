// src/modules/perfiles/perfil.routes.ts
import { Router } from "express";
import { obtenerMiPerfil, actualizarPerfil } from "./perfil.controller";
import { verificarToken } from "../../middlewares/auth.middleware";

const router = Router();

// Endpoints protegidos para el perfil del usuario autenticado
router.get("/me", verificarToken, obtenerMiPerfil);
router.patch("/me", verificarToken, actualizarPerfil);

export default router;
