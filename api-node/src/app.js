/*
|--------------------------------------------------------------------------
| IMPORTS
|--------------------------------------------------------------------------
| express: crea el servidor API.
| cors: permite llamadas desde frontend (React/Electron).
| dotenv: lee variables del archivo .env, como el puerto.
*/

const express = require("express");
const cors = require("cors");
require("dotenv").config();

/*
|--------------------------------------------------------------------------
| APP
|--------------------------------------------------------------------------
| Este archivo es el inicio del backend.
| Aqui se configura Express, se cargan rutas y se arranca el servidor.
*/

const app = express();

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
| Permite conexiones desde React/Electron/frontend.
*/

app.use(cors());

/*
|--------------------------------------------------------------------------
| JSON
|--------------------------------------------------------------------------
| Permite recibir datos en formato JSON.
*/

app.use(express.json());

/*
|--------------------------------------------------------------------------
| STATIC MEDIA
|--------------------------------------------------------------------------
| Esta parte NO es una API.
| Solo sirve archivos de la carpeta media.
| Ejemplo: http://localhost:3000/media/imagen.png
*/

app.use("/media", express.static("../media"));





















/*
|--------------------------------------------------------------------------
| ROUTES
|--------------------------------------------------------------------------
| Las rutas de la API empiezan con /api.
| app.js no hace la logica de negocio.
| Solo conecta la ruta con su controller.
| Si quieres ver la API en el navegador, entra a:
| http://localhost:3000/api/explorar
| Flujo de explorar:
| app.js -> /api/explorar -> routes/explorar.routes.js -> controllers/explorar.controller.js
*/

// CONTENIDO GENERAL: grupos, generos y canciones
// Se consulta en navegador con: http://localhost:3000/api/explorar
const explorarRoutes = require("./routes/explorar.routes");
app.use("/api/explorar", explorarRoutes);

// INFORMACION DETALLADA DE UN USUARIO CON SU BIBLIOTECA
// Ruta base: /api
// Ruta completa real: /api/usuarios/:id/biblioteca
// Ejemplo en navegador (usuario 1): http://localhost:3000/api/usuarios/1/biblioteca
const bibliotecaRoutes = require("./routes/biblioteca.routes");
app.use("/api", bibliotecaRoutes);


// RUTAS DE AVATARES Y USUARIOS
// 1) Listar avatares (GET):
//    Ruta final: /api/avatares
//    En navegador: http://localhost:3000/api/avatares
const avatarRoutes = require("./routes/avatar.routes");
app.use("/api/avatares", avatarRoutes);

// 2) Crear usuario (POST):
//    Ruta final: /api/usuarios
//    Esta ruta NO se prueba escribiendo la URL en el navegador,
//    porque el navegador abre GET por defecto.
//    Para crear usuario usa Postman/Insomnia o fetch/axios desde frontend.
const usuarioRoutes = require("./routes/usuario.routes");
app.use("/api/usuarios", usuarioRoutes);


// RUTAS DE MUSICA
// app.js monta la base: /api/musica
// musica.routes.js completa el camino final.
// Ejemplos para navegador:
// - GET http://localhost:3000/api/musica
// - GET http://localhost:3000/api/musica/1
// Relación de archivos:
// app.js -> routes/musica.routes.js -> controllers/musica.controller.js -> models/musica.model.js
const musicaRoutes = require("./routes/musica.routes");
app.use("/api/musica", musicaRoutes);

// RUTAS DE PLAYLIST
// app.js monta la base: /api
// playlist.routes.js agrega el resto del camino.
// Ejemplos de rutas finales:
// - GET  http://localhost:3000/api/usuarios/1/listas
// - POST http://localhost:3000/api/usuarios/1/listas
// - POST http://localhost:3000/api/listas/2/canciones/10
// - DELETE http://localhost:3000/api/listas/2/canciones/10
// - DELETE http://localhost:3000/api/listas/2
const playlistRoutes = require("./routes/playlist.routes");
app.use("/api", playlistRoutes);

// RUTAS DE GRUPOS MUSICALES
const grupoRoutes = require("./routes/grupo.routes");
app.use("/api/grupos-musicales", grupoRoutes);

// RUTAS DE GENEROS MUSICALES
// Relación: app.js monta la ruta base y direcciona a src/routes/genero.routes.js
const generoRoutes = require("./routes/genero.routes");
// Montamos las rutas de géneros en /api/generos-musicales
// Ejemplo: GET http://localhost:3000/api/generos-musicales
app.use("/api/generos-musicales", generoRoutes);













/*
|--------------------------------------------------------------------------
| ROOT
|--------------------------------------------------------------------------
| Si abres http://localhost:3000/ en el navegador,
| esta ruta responde con un JSON simple para decir que el servidor esta vivo.
| La data de la API la ves en /api/explorar.
*/

app.get("/", (req, res) => {
    res.json({
        mensaje: "API musicBH funcionando",
    });
});

/*
|--------------------------------------------------------------------------
| SERVER
|--------------------------------------------------------------------------
| El servidor usa el puerto de .env o 3000 por defecto.
| Luego puedes abrir el servidor en:
| http://localhost:3000/
*/

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`
========================================
🚀 API musicBH corriendo
🌐 http://localhost:${PORT}
========================================
    `);
});