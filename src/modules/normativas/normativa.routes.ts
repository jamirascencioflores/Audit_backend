// src/modules/normativas/normativa.routes.ts
import { Router } from "express";
import { obtenerNormas } from "./normativa.controller";
import { verificarToken } from "../../middlewares/auth.middleware";

const router = Router();

// Endpoint: GET /api/normativas
router.get("/", verificarToken, obtenerNormas);

export default router;
