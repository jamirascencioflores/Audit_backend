import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verificarToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Se espera el formato "Bearer <token>"
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Acceso denegado. Token no proporcionado." });
    return;
  }

  try {
    const decodificado = jwt.verify(token, process.env.JWT_SECRET as string);
    // Guardamos los datos del token en la request para usarlos en los controladores
    (req as any).usuario = decodificado;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido o expirado." });
  }
};
