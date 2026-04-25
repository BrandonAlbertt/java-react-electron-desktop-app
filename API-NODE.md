# API-NODE

## Finalidad

`api-node` es el backend/API del proyecto de música.

Su función principal es:

- Conectarse a MariaDB
- Exponer endpoints REST
- Servir información al frontend React/Electron
- Gestionar canciones, usuarios, listas y géneros
- Servir rutas de archivos multimedia (audio, portadas, avatares)

Arquitectura general:

```text
Frontend React/Electron
        ↓
API Node.js (api-node)
        ↓
MariaDB
        ↓
Archivos multimedia
```

---

# Instalación inicial

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
npm init -y
```

---

## Instalar dependencias principales

```bash
npm install express cors dotenv mysql2
```

### Explicación

| Paquete | Finalidad |
|---|---|
| express | Framework backend/API |
| cors | Permite conexión frontend-backend |
| dotenv | Variables de entorno |
| mysql2 | Conexión MariaDB/MySQL |

---

## Instalar dependencias de desarrollo

```bash
npm install -D nodemon
```

### Finalidad

`nodemon` reinicia automáticamente el servidor cuando detecta cambios.

---

# Estructura recomendada

```text
api-node/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── routes/
│   │   └── musica.routes.js
│   │
│   ├── controllers/
│   │   └── musica.controller.js
│   │
│   ├── services/
│   │
│   ├── models/
│   │
│   └── app.js
│
├── .env
├── package.json
└── README.md
```

---

# Configuración de scripts

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

# Conexión MariaDB

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
npm run dev
```

---

## Producción

```bash
npm start
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

# Tecnologías usadas

- Node.js
- Express
- MariaDB
- Docker
- Electron
- React
- SQL
