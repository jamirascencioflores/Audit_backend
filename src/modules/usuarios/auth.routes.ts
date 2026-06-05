// src/modules/usuarios/auth.routes.ts
import { Router } from "express";
import { login } from "./auth.controller";

const router = Router();

// Endpoint: POST /api/auth/login
router.post("/login", login);

export default router;
