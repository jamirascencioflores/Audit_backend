import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./modules/usuarios/auth.routes"; // <-- Importación
import auditoriaRoutes from "./modules/auditorias/auditoria.routes";
import normativaRoutes from './modules/normativas/normativa.routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Montar las rutas
app.use("/api/auth", authRoutes); // <-- Conexión

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "DoAudit Backend is running smoothly 🚀" });
});

app.use("/api/auditorias", auditoriaRoutes);
app.use('/api/normativas', normativaRoutes);


app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
