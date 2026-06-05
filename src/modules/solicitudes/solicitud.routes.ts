import { Router } from "express";
import {
  crearSolicitud,
  obtenerSolicitudes,
  evaluarSolicitud,
  activarCuenta,
} from "./solicitud.controller";

const router = Router();

// Endpoint: POST /api/solicitudes (Público - Crea solicitud)
router.post("/", crearSolicitud);

// Endpoint: GET /api/solicitudes (Soporte - Lista solicitudes)
router.get("/", obtenerSolicitudes);

// Endpoint: PATCH /api/solicitudes/:id/evaluar (Soporte - Aprueba/Rechaza)
router.patch("/:id/evaluar", evaluarSolicitud);

// Endpoint: POST /api/solicitudes/activar/:token (Público - Activación)
router.post("/activar/:token", activarCuenta);

export default router;
