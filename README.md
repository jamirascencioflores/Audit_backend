# 🌍 Nos Planét Audit - Backend API

API RESTful desarrollada para la gestión, planificación y seguimiento de auditorías. Este backend provee los endpoints necesarios para que el cliente (Frontend) consuma la lógica de negocio, gestione usuarios, roles, acciones correctivas y métricas.

## 🛠️ Stack Tecnológico

- **Entorno de ejecución:** Node.js
- **Framework:** Express.js
- **Lenguaje:** TypeScript
- **ORM:** Prisma
- **Autenticación:** JSON Web Tokens (JWT) & bcryptjs
- **Mailing:** Nodemailer

---

## 🚀 Configuración y Levantamiento Local

Sigue estos pasos para levantar el entorno de desarrollo local:

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar Variables de Entorno:**
    Crea un archivo `.env` en la raíz del pryecto basándote en el siguiente ejemplo:

   ```
   Puerto del servidor
    PORT=4000

   Conexión a la base de datos
    DATABASE_URL="mysql://usuario:password@localhost:3306/nombre_bd"

   Secreto para firmar los tokens JWT
    JWT_SECRET="tu_super_secreto_jwt"

   Configuración de Nodemailer (Correos de Invitación)
    SMTP_HOST=smtp.gmail.com
    SMTP_PORT=465
    SMTP_USER=tu_correo@gmail.com
    SMTP_PASS=tu_contraseña_de_aplicacion_aqui
   ```

3. **Generar el cliente de Prisma y correr migraciones:**
   ```bash
    npx prisma generate
    npx prisma migrate dev
   ```

4. **Iniciar el servidor en modo desarrollo:**
   ```bash
    npm run dev
   ```

## 🔐 Autenticación y Autorización
Todas las rutas (a excepción del Login) están protegidas. El frontend debe enviar el token JWT obtenido en el Login dentro de las cabeceras (`Headers`) de cada petición HTTP:
  ```
   Authorization: Bearer <TU_TOKEN_JWT>
  ```

### 👥 Roles del Sistema
El comportamiento de la API y los permisos dependen del rol del usuario autenticado:
* **Rol 1 (Auditor Admin):** Tiene control total. Puede invitar a otros auditores y gestionar la empresa.
* **Rol 2 (Auditor Regular):** Acceso estándar para ejecutar auditorías y gestionar hallazgos.

## 🚦 Manejo de Errores
La API utiliza respuestas JSON estandarizadas para el manejo de errores. El frontend debe estar preparado para capturar estas respuestas y mostrar alertas al usuario.

**Estructura de Error (HTTP 400, 403, 500):**
  ```
    {
        "error": "Mensaje descriptivo del error para mostrar al usuario."
    }  
```

## 📡 Endpoints Principales (Colección).
A continuación, los endpoints clave.

### 1. Sedes
* `POST /api/sedes` - Crea una nueva sede vinculada a la empresa.

### 2. Perfiles de Usuario
* `GET /api/perfiles/me` - Obtiene la información y competencias del usuario logueado.
* `PATCH /api/perfiles/me` - Actualiza datos personales y profesionales (teléfono, idioma, experiencia).

### 3. Seguimiento y Acciones Correctivas
* `POST /api/seguimiento/acciones` - Asigna una nueva acción correctiva a un hallazgo.
* `GET /api/seguimiento/trazabilidad/:id_auditoria` - Retorna la línea de tiempo cronológica de los cambios de estado de una auditoría.

### 4. Invitaciones (Onboarding Interno)
* `POST /api/invitaciones` - Genera un token y envía un correo real (Nodemailer) invitando a un nuevo auditor al equipo. (Solo Rol 1).

### 5. Reportes y Dashboard
* `GET /api/reportes/dashboard` - Devuelve las métricas agrupadas y conteos por estado de las auditorías y acciones correctivas para renderizar gráficos.

---

## 📋 Información de Acceso y Configuración para el Proyecto (Nos Planét)
Hola equipo, les comparto los datos necesarios para levantar el entorno de desarrollo y realizar las primeras pruebas de conexión con el backend:

### 1. Script de Datos Iniciales (Seed) 
He configurado un script de carga inicial que poblará la base de datos con una estructura real (Empresa, Sedes, Normas, Áreas y Usuarios). Para ejecutarlo, una vez tengan configurado su .env, corran:
   ```bash
   npx prisma db seed
   ```

### 2. Cuentas de Acceso (Credenciales de Prueba)
El script generará automáticamente los siguientes usuarios para que puedan probar los diferentes roles y niveles de acceso en el sistema:
* **Auditor Administrador (Rol 1):**
   * **Correo:** `auditor@nosplanet.com`
   * **Contraseña:** `Auditor2026!`
   * Uso: Ideal para probar las rutas de invitación, creación de sedes y gestión de perfiles.

### 3. Notas para el Frontend
* **Empresa de prueba creada:** "Nos Planét Agro SAC" (RUC: `20123456789`).
* **Normas cargadas:** ISO 22000 y GLOBALG.A.P.
* **Requisitos:** Ya tienen cargados requisitos iniciales para el "Campo" y "Planta" que pueden listar para sus formularios.

### 📝 Recordatorio
Si llegan a recibir un error al hacer login o al intentar consultar datos, recuerden verificar que el token JWT que reciben al loguearse lo están enviando correctamente en el Header de cada petición bajo la clave `Authorization: Bearer <TOKEN>`.

Cualquier duda o dato que necesiten que agregue al script de seed para sus pruebas de interfaz (UI), avísenme. 