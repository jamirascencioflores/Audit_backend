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

