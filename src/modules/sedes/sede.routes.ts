// src/modules/sedes/sede.routes.ts
import { Router } from "express";
import { crearSede, obtenerSedes } from "./sede.controller";
import { verificarToken } from "../../middlewares/auth.middleware";

const router = Router();

// Endpoints protegidos para gestionar sedes de la empresa
router.post("/", verificarToken, crearSede);
router.get("/", verificarToken, obtenerSedes);

export default router;