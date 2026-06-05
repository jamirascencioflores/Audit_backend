/// <reference types="node" />
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando el poblamiento de la base de datos (DoAudit)...");

  // 1. EMPRESA (El pilar de todo)
  const empresa = await prisma.empresa.upsert({
    where: { ruc: "20123456789" },
    update: {},
    create: {
      razon_social: "Nos Planét Agro SAC",
      ruc: "20123456789",
      direccion: "Av. Agrícola 123, Ica",
      telefono: "999888777",
      correo: "contacto@nosplanet.com",
      estado: true,
    },
  });
  console.log(`✅ Empresa creada: ${empresa.razon_social}`);

  // 2. SEDES
  const sedePrincipal = await prisma.sede.create({
    data: {
      id_empresa: empresa.id_empresa,
      nombre: "Fundo San José - Principal",
      direccion: "Panamericana Sur Km 300",
    },
  });
  console.log(`✅ Sede creada: ${sedePrincipal.nombre}`);

  // 3. USUARIO LÍDER Y SU PERFIL
  const passwordPlain = "Auditor2026!";
  const passwordHash = await bcrypt.hash(passwordPlain, 10);

  const auditor = await prisma.usuario.upsert({
    where: { correo: "auditor@nosplanet.com" },
    update: {},
    create: {
      id_empresa: empresa.id_empresa,
      nombres: "Auditor Agroindustrial Jefe",
      dni: "12345678",
      correo: "auditor@nosplanet.com",
      telefono: "987654321",
      password_hash: passwordHash,
      id_rol: 1, // 1: Auditor Admin
      estado: "ACTIVO",
      perfil: {
        create: {
          num_colegiatura: "CIP-98765",
          colegio_profesional: "Colegio de Ingenieros del Perú",
          especialidad: "Ingeniería Agroindustrial e Inocuidad",
          anios_experiencia: 8,
          pais: "Perú",
          zona_horaria: "America/Lima",
          idioma: "Español",
        },
      },
    },
  });
  console.log(`✅ Usuario creado: ${auditor.correo}`);

  // 4. CATÁLOGO: NORMAS
  const normaISO22000 = await prisma.norma.create({
    data: { nombre: "ISO 22000 - Inocuidad Alimentaria", version: "2018" },
  });
  const normaGlobalGap = await prisma.norma.create({
    data: { nombre: "GLOBALG.A.P. Aseguramiento Integrado", version: "V6.0" },
  });

  // 5. CATÁLOGO: ÁREAS
  const areaCampo = await prisma.area.create({
    data: { nombre: "Campo y Cosecha" },
  });
  const areaPlanta = await prisma.area.create({
    data: { nombre: "Planta de Procesamiento" },
  });
  const areaAlmacen = await prisma.area.create({
    data: { nombre: "Almacenes y Despacho" },
  });

  // 6. CATÁLOGO: REQUISITOS (Checklists de auditoría)
  await prisma.requisitoNorma.createMany({
    data: [
      // Requisitos ISO 22000
      {
        id_norma: normaISO22000.id_norma,
        id_area: areaPlanta.id_area,
        codigo_requisito: "8.5.1",
        descripcion:
          "Análisis de peligros preliminar documentado y actualizado.",
      },
      {
        id_norma: normaISO22000.id_norma,
        id_area: areaPlanta.id_area,
        codigo_requisito: "8.5.4",
        descripcion:
          "Plan de control de peligros (HACCP/OPRP) implementado en línea de proceso.",
      },
      {
        id_norma: normaISO22000.id_norma,
        id_area: areaAlmacen.id_area,
        codigo_requisito: "8.2.4",
        descripcion:
          "Zonificación y control de temperatura en cámaras de frío.",
      },

      // Requisitos GLOBALG.A.P.
      {
        id_norma: normaGlobalGap.id_norma,
        id_area: areaCampo.id_area,
        codigo_requisito: "CB.4.1",
        descripcion: "Registro detallado de aplicación de fertilizantes.",
      },
      {
        id_norma: normaGlobalGap.id_norma,
        id_area: areaCampo.id_area,
        codigo_requisito: "CB.5.2",
        descripcion:
          "Análisis microbiológico y metales pesados del agua de riego vigente.",
      },
    ],
  });
  console.log(`✅ Catálogo normativo y áreas poblados con éxito`);

  // 7. COMPETENCIAS DEL AUDITOR
  // Habilitamos al auditor líder para auditar estas normas en áreas específicas
  await prisma.competenciaAuditor.createMany({
    data: [
      {
        id_usuario: auditor.id_usuario,
        id_norma: normaISO22000.id_norma,
        id_area: areaPlanta.id_area,
        id_sede: sedePrincipal.id_sede,
      },
      {
        id_usuario: auditor.id_usuario,
        id_norma: normaGlobalGap.id_norma,
        id_area: areaCampo.id_area,
        id_sede: sedePrincipal.id_sede,
      },
    ],
  });

  console.log("🚀 ¡Base de datos lista para pruebas de la API!");
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
