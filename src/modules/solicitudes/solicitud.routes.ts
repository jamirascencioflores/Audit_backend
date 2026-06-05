// src/modules/solicitudes/solicitud.routes.ts
import { Router } from "express";
import {
  crearSolicitud,
  obtenerSolicitudes,
  evaluarSolicitud,
  activarCuenta,
} from "./solicitud.controller";
import {
  verificarToken,
  verificarRolSoporte,
} from "../../middlewares/auth.middleware";

const router = Router();

// ==========================================
// RUTAS PÚBLICAS
// ==========================================
router.post("/", crearSolicitud);
router.post("/activar/:token", activarCuenta);

// ==========================================
// RUTAS PROTEGIDAS (Solo Soporte Nos Planét)
// ==========================================
router.get("/", verificarToken, verificarRolSoporte, obtenerSolicitudes);
router.patch("/:id/evaluar", verificarToken, verificarRolSoporte, evaluarSolicitud);

export default router;