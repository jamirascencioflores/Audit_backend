// src/modules/reportes/reporte.routes.ts
import { Router } from "express";
import { obtenerMetricasDashboard } from "./reporte.controller";
import { verificarToken } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/dashboard", verificarToken, obtenerMetricasDashboard);

export default router;
