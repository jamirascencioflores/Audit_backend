// src/modules/seguimiento/accion.routes.ts
import { Router } from "express";
import {
  crearAccion,
  obtenerMisAcciones,
  actualizarEstadoAccion,
} from "./accion.controller";
import { verificarToken } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", verificarToken, crearAccion);
router.get("/mis-tareas", verificarToken, obtenerMisAcciones);
router.patch("/:id/estado", verificarToken, actualizarEstadoAccion);

export default router;
