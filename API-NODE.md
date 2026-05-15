# API-NODE

## Finalidad

`api-node` es el backend/API del proyecto de mÃºsica.

Su funciÃ³n principal es:

- Conectarse a MariaDB
- Exponer endpoints REST
- Servir informaciÃ³n al frontend React/Electron
- Gestionar canciones, usuarios, listas y gÃ©neros
- Servir rutas de archivos multimedia (audio, portadas, avatares)

Arquitectura general:

```text
Frontend React/Electron
        â†“
API Node.js (api-node)
        â†“
MariaDB
        â†“
Archivos multimedia
```

---

# InstalaciÃ³n inicial

## 1. Clonar el proyecto

```bash
git clone URL_DEL_REPOSITORIO
```

Ejemplo:

```bash
git clone https://github.com/usuario/mi-app-desktop.git
```

---

## 2. Entrar al proyecto

```bash
cd mi-app-desktop
```

---

## 3. Entrar a la carpeta del backend

```bash
cd api-node
```

---

# Crear API Node.js

## Inicializar Node

```bash
pnpm init
```

---

## Instalar dependencias principales

```bash
pnpm add express cors dotenv mysql2
```

### ExplicaciÃ³n

| Paquete | Finalidad |
|---|---|
| express | Framework backend/API |
| cors | Permite conexiÃ³n frontend-backend |
| dotenv | Variables de entorno |
| mysql2 | ConexiÃ³n MariaDB/MySQL |

---

## Instalar dependencias de desarrollo

```bash
pnpm add -D nodemon
```

### Finalidad

`nodemon` reinicia automÃ¡ticamente el servidor cuando detecta cambios.

---

# Estructura recomendada

```text
api-node/
â”‚
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ config/
â”‚   â”‚   â””â”€â”€ db.js
â”‚   â”‚
â”‚   â”œâ”€â”€ routes/
â”‚   â”‚   â””â”€â”€ musica.routes.js
â”‚   â”‚
â”‚   â”œâ”€â”€ controllers/
â”‚   â”‚   â””â”€â”€ musica.controller.js
â”‚   â”‚
â”‚   â”œâ”€â”€ services/
â”‚   â”‚
â”‚   â”œâ”€â”€ models/
â”‚   â”‚
â”‚   â””â”€â”€ app.js
â”‚
â”œâ”€â”€ .env
â”œâ”€â”€ package.json
â””â”€â”€ README.md
```

---

# ConfiguraciÃ³n de scripts

Editar `package.json`:

```json
"scripts": {
  "dev": "nodemon src/app.js",
  "start": "node src/app.js"
}
```

---

# Variables de entorno

Crear archivo `.env`

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=musicdb
```

---

# ConexiÃ³n MariaDB

Archivo:

```text
src/config/db.js
```

```js
const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

module.exports = pool;
```

---

# Ejecutar proyecto

## Desarrollo

```bash
pnpm dev
```

---

## ProducciÃ³n

```bash
pnpm start
```

---

# Docker

La API puede ejecutarse mediante Docker.

El proyecto principal puede contener:

```text
Dockerfile
docker-compose.yml
```

El contenedor API se comunica con MariaDB mediante red interna Docker.

---

# Flujo de trabajo recomendado

## Crear rama de trabajo

```bash
git checkout -b feature/api-node
```

---

## Guardar cambios

```bash
git add .
git commit -m "feat: crear estructura api-node"
```

---

## Subir cambios

```bash
git push origin feature/api-node
```

---

# TecnologÃ­as usadas

- Node.js
- Express
- MariaDB
- Docker
- Electron
- React
- SQL

