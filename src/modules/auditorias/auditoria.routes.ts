// src/modules/auditorias/auditoria.routes.ts
import { Router } from "express";
import {
  obtenerAuditorias,
  crearAuditoria,
  obtenerChecklist,
  evaluarRequisito,
  cambiarEstado,
} from "./auditoria.controller";
import { verificarToken } from "../../middlewares/auth.middleware";

const router = Router();

// Endpoint: GET /api/auditorias (Protegido)
router.get("/", verificarToken, obtenerAuditorias);

// Endpoint: POST /api/auditorias (Protegido)
router.post("/", verificarToken, crearAuditoria);

// Endpoint: GET /api/auditorias/:id/checklist (Protegido)
router.get("/:id/checklist", verificarToken, obtenerChecklist);

// Endpoint: POST /api/auditorias/:id/evaluacion (Protegido)
router.post("/:id/evaluacion", verificarToken, evaluarRequisito);

// Endpoint: PATCH /api/auditorias/:id/estado (Protegido)
router.patch("/:id/estado", verificarToken, cambiarEstado);

export default router;
