-- CreateTable
CREATE TABLE "SolicitudRegistro" (
    "id_solicitud" SERIAL NOT NULL,
    "empresa_razon_social" TEXT NOT NULL,
    "empresa_ruc" TEXT NOT NULL,
    "empresa_direccion" TEXT NOT NULL,
    "empresa_telefono" TEXT NOT NULL,
    "empresa_correo" TEXT NOT NULL,
    "auditor_nombres" TEXT NOT NULL,
    "auditor_dni" TEXT NOT NULL,
    "auditor_correo" TEXT NOT NULL,
    "auditor_telefono" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "ip_dispositivo" TEXT,
    "token_activacion" TEXT,
    "fecha_exp_token" TIMESTAMP(3),
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SolicitudRegistro_pkey" PRIMARY KEY ("id_solicitud")
);

-- CreateTable
CREATE TABLE "BitacoraSoporte" (
    "id_bitacora" SERIAL NOT NULL,
    "id_solicitud" INTEGER NOT NULL,
    "id_usuario_soporte" INTEGER NOT NULL,
    "tipo_interaccion" TEXT NOT NULL,
    "comentarios" TEXT NOT NULL,
    "fecha_interaccion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BitacoraSoporte_pkey" PRIMARY KEY ("id_bitacora")
);

-- CreateTable
CREATE TABLE "Empresa" (
    "id_empresa" SERIAL NOT NULL,
    "razon_social" TEXT NOT NULL,
    "ruc" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id_empresa")
);

-- CreateTable
CREATE TABLE "Sede" (
    "id_sede" SERIAL NOT NULL,
    "id_empresa" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,

    CONSTRAINT "Sede_pkey" PRIMARY KEY ("id_sede")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id_usuario" SERIAL NOT NULL,
    "id_empresa" INTEGER NOT NULL,
    "nombres" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "telefono" TEXT,
    "password_hash" TEXT NOT NULL,
    "id_rol" INTEGER NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "PerfilProfesional" (
    "id_perfil" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "num_colegiatura" TEXT,
    "colegio_profesional" TEXT,
    "especialidad" TEXT,
    "anios_experiencia" INTEGER,
    "pais" TEXT,
    "zona_horaria" TEXT,
    "idioma" TEXT,

    CONSTRAINT "PerfilProfesional_pkey" PRIMARY KEY ("id_perfil")
);

-- CreateTable
CREATE TABLE "InvitacionAuditor" (
    "id_invitacion" SERIAL NOT NULL,
    "id_empresa" INTEGER NOT NULL,
    "id_usuario_admin" INTEGER NOT NULL,
    "correo_invitado" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_expiracion" TIMESTAMP(3) NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "InvitacionAuditor_pkey" PRIMARY KEY ("id_invitacion")
);

-- CreateTable
CREATE TABLE "Norma" (
    "id_norma" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "version" TEXT NOT NULL,

    CONSTRAINT "Norma_pkey" PRIMARY KEY ("id_norma")
);

-- CreateTable
CREATE TABLE "Area" (
    "id_area" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id_area")
);

-- CreateTable
CREATE TABLE "RequisitoNorma" (
    "id_requisito" SERIAL NOT NULL,
    "id_norma" INTEGER NOT NULL,
    "id_area" INTEGER NOT NULL,
    "codigo_requisito" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "RequisitoNorma_pkey" PRIMARY KEY ("id_requisito")
);

-- CreateTable
CREATE TABLE "CompetenciaAuditor" (
    "id_usuario" INTEGER NOT NULL,
    "id_norma" INTEGER NOT NULL,
    "id_area" INTEGER NOT NULL,
    "id_sede" INTEGER NOT NULL,

    CONSTRAINT "CompetenciaAuditor_pkey" PRIMARY KEY ("id_usuario","id_norma","id_area","id_sede")
);

-- CreateTable
CREATE TABLE "Auditoria" (
    "id_auditoria" SERIAL NOT NULL,
    "id_empresa" INTEGER NOT NULL,
    "id_sede" INTEGER NOT NULL,
    "id_norma" INTEGER NOT NULL,
    "id_area" INTEGER NOT NULL,
    "fecha_programada" DATE NOT NULL,
    "hora_inicio" TIME NOT NULL,
    "duracion_estimada" TIME NOT NULL,
    "alcance" TEXT,
    "estado" TEXT NOT NULL,
    "firma_auditor_principal" VARCHAR(255),
    "comentario_final" TEXT,

    CONSTRAINT "Auditoria_pkey" PRIMARY KEY ("id_auditoria")
);

-- CreateTable
CREATE TABLE "AuditoriaEquipo" (
    "id_auditoria" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "rol" TEXT NOT NULL,

    CONSTRAINT "AuditoriaEquipo_pkey" PRIMARY KEY ("id_auditoria","id_usuario")
);

-- CreateTable
CREATE TABLE "AuditoriaEvaluacion" (
    "id_evaluacion" SERIAL NOT NULL,
    "id_auditoria" INTEGER NOT NULL,
    "id_requisito" INTEGER NOT NULL,
    "clasificacion" TEXT NOT NULL,
    "fecha_evaluacion" TIMESTAMP NOT NULL,

    CONSTRAINT "AuditoriaEvaluacion_pkey" PRIMARY KEY ("id_evaluacion")
);

-- CreateTable
CREATE TABLE "Hallazgo" (
    "id_hallazgo" SERIAL NOT NULL,
    "id_evaluacion" INTEGER NOT NULL,
    "criticidad" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "Hallazgo_pkey" PRIMARY KEY ("id_hallazgo")
);

-- CreateTable
CREATE TABLE "Evidencia" (
    "id_evidencia" SERIAL NOT NULL,
    "id_evaluacion" INTEGER NOT NULL,
    "id_usuario_captura" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "formato" TEXT NOT NULL,
    "url_archivo" VARCHAR(255) NOT NULL,
    "fecha_captura" TIMESTAMP NOT NULL,
    "latitud" DECIMAL(10,8),
    "longitud" DECIMAL(11,8),

    CONSTRAINT "Evidencia_pkey" PRIMARY KEY ("id_evidencia")
);

-- CreateTable
CREATE TABLE "AccionCorrectiva" (
    "id_accion" SERIAL NOT NULL,
    "id_hallazgo" INTEGER NOT NULL,
    "id_usuario_responsable" INTEGER NOT NULL,
    "descripcion_plan" TEXT NOT NULL,
    "plazo_resolucion" DATE NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "AccionCorrectiva_pkey" PRIMARY KEY ("id_accion")
);

-- CreateTable
CREATE TABLE "AuditoriaTrazabilidad" (
    "id_trazabilidad" SERIAL NOT NULL,
    "id_auditoria" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "accion" TEXT NOT NULL,
    "fecha_accion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "motivo_reapertura" TEXT,

    CONSTRAINT "AuditoriaTrazabilidad_pkey" PRIMARY KEY ("id_trazabilidad")
);

-- CreateIndex
CREATE UNIQUE INDEX "SolicitudRegistro_empresa_ruc_key" ON "SolicitudRegistro"("empresa_ruc");

-- CreateIndex
CREATE UNIQUE INDEX "SolicitudRegistro_auditor_dni_key" ON "SolicitudRegistro"("auditor_dni");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_ruc_key" ON "Empresa"("ruc");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_dni_key" ON "Usuario"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "PerfilProfesional_id_usuario_key" ON "PerfilProfesional"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "InvitacionAuditor_correo_invitado_key" ON "InvitacionAuditor"("correo_invitado");

-- CreateIndex
CREATE UNIQUE INDEX "Hallazgo_id_evaluacion_key" ON "Hallazgo"("id_evaluacion");

-- AddForeignKey
ALTER TABLE "BitacoraSoporte" ADD CONSTRAINT "BitacoraSoporte_id_solicitud_fkey" FOREIGN KEY ("id_solicitud") REFERENCES "SolicitudRegistro"("id_solicitud") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sede" ADD CONSTRAINT "Sede_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "Empresa"("id_empresa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "Empresa"("id_empresa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerfilProfesional" ADD CONSTRAINT "PerfilProfesional_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvitacionAuditor" ADD CONSTRAINT "InvitacionAuditor_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "Empresa"("id_empresa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvitacionAuditor" ADD CONSTRAINT "InvitacionAuditor_id_usuario_admin_fkey" FOREIGN KEY ("id_usuario_admin") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequisitoNorma" ADD CONSTRAINT "RequisitoNorma_id_norma_fkey" FOREIGN KEY ("id_norma") REFERENCES "Norma"("id_norma") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequisitoNorma" ADD CONSTRAINT "RequisitoNorma_id_area_fkey" FOREIGN KEY ("id_area") REFERENCES "Area"("id_area") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetenciaAuditor" ADD CONSTRAINT "CompetenciaAuditor_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetenciaAuditor" ADD CONSTRAINT "CompetenciaAuditor_id_norma_fkey" FOREIGN KEY ("id_norma") REFERENCES "Norma"("id_norma") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetenciaAuditor" ADD CONSTRAINT "CompetenciaAuditor_id_area_fkey" FOREIGN KEY ("id_area") REFERENCES "Area"("id_area") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetenciaAuditor" ADD CONSTRAINT "CompetenciaAuditor_id_sede_fkey" FOREIGN KEY ("id_sede") REFERENCES "Sede"("id_sede") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auditoria" ADD CONSTRAINT "Auditoria_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "Empresa"("id_empresa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auditoria" ADD CONSTRAINT "Auditoria_id_sede_fkey" FOREIGN KEY ("id_sede") REFERENCES "Sede"("id_sede") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auditoria" ADD CONSTRAINT "Auditoria_id_norma_fkey" FOREIGN KEY ("id_norma") REFERENCES "Norma"("id_norma") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auditoria" ADD CONSTRAINT "Auditoria_id_area_fkey" FOREIGN KEY ("id_area") REFERENCES "Area"("id_area") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditoriaEquipo" ADD CONSTRAINT "AuditoriaEquipo_id_auditoria_fkey" FOREIGN KEY ("id_auditoria") REFERENCES "Auditoria"("id_auditoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditoriaEquipo" ADD CONSTRAINT "AuditoriaEquipo_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditoriaEvaluacion" ADD CONSTRAINT "AuditoriaEvaluacion_id_auditoria_fkey" FOREIGN KEY ("id_auditoria") REFERENCES "Auditoria"("id_auditoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditoriaEvaluacion" ADD CONSTRAINT "AuditoriaEvaluacion_id_requisito_fkey" FOREIGN KEY ("id_requisito") REFERENCES "RequisitoNorma"("id_requisito") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hallazgo" ADD CONSTRAINT "Hallazgo_id_evaluacion_fkey" FOREIGN KEY ("id_evaluacion") REFERENCES "AuditoriaEvaluacion"("id_evaluacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidencia" ADD CONSTRAINT "Evidencia_id_evaluacion_fkey" FOREIGN KEY ("id_evaluacion") REFERENCES "AuditoriaEvaluacion"("id_evaluacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidencia" ADD CONSTRAINT "Evidencia_id_usuario_captura_fkey" FOREIGN KEY ("id_usuario_captura") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccionCorrectiva" ADD CONSTRAINT "AccionCorrectiva_id_hallazgo_fkey" FOREIGN KEY ("id_hallazgo") REFERENCES "Hallazgo"("id_hallazgo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccionCorrectiva" ADD CONSTRAINT "AccionCorrectiva_id_usuario_responsable_fkey" FOREIGN KEY ("id_usuario_responsable") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditoriaTrazabilidad" ADD CONSTRAINT "AuditoriaTrazabilidad_id_auditoria_fkey" FOREIGN KEY ("id_auditoria") REFERENCES "Auditoria"("id_auditoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditoriaTrazabilidad" ADD CONSTRAINT "AuditoriaTrazabilidad_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
