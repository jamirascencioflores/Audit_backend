import express, { Application, Request, Response } from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./modules/usuarios/auth.routes"; // <-- Importación
import auditoriaRoutes from "./modules/auditorias/auditoria.routes";
import normativaRoutes from "./modules/normativas/normativa.routes";
import solicitudRoutes from './modules/solicitudes/solicitud.routes';
import invitacionRoutes from './modules/invitaciones/invitacion.routes';
import sedeRoutes from './modules/sedes/sede.routes';
import perfilRoutes from './modules/perfiles/perfil.routes';
import accionRoutes from './modules/seguimiento/accion.routes';
import trazabilidadRoutes from './modules/seguimiento/trazabilidad.routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Nueva línea para servir los archivos estáticos:
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Montar las rutas
app.use("/api/auth", authRoutes); // <-- Conexión

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "DoAudit Backend is running smoothly 🚀" });
});

app.use("/api/auditorias", auditoriaRoutes);
app.use("/api/normativas", normativaRoutes);

app.use('/api/solicitudes', solicitudRoutes);

app.use('/api/invitaciones', invitacionRoutes);

app.use('/api/sedes', sedeRoutes);

app.use('/api/perfiles', perfilRoutes);

app.use('/api/seguimiento/acciones', accionRoutes);

app.use('/api/seguimiento/trazabilidad', trazabilidadRoutes);

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
