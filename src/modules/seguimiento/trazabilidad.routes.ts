// src/modules/seguimiento/trazabilidad.routes.ts  
import { Router } from "express";
import { obtenerTrazabilidad } from "./trazabilidad.controller";
import { verificarToken } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/:id_auditoria", verificarToken, obtenerTrazabilidad);

export default router;
