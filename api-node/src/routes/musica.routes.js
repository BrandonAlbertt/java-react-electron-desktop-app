// =============================
// RUTAS DE MUSICA
// =============================
// flujo:
//
// app.js
// -> musica.routes.js
// -> musica.controller.js
// -> musica.model.js
// -> base de datos
//
// prefijo principal:
// /api/musica
//
// ejemplos:
//
// GET    /api/musica/listar
// GET    /api/musica/obtener/1
// POST   /api/musica/crear
// POST   /api/musica/crear-con-audio
// PUT    /api/musica/actualizar/1
// DELETE /api/musica/eliminar/1
// =============================

const express = require("express");

const router = express.Router();

// =============================
// IMPORTAR MIDDLEWARE AUDIO
// =============================
// multer para subir canciones
const uploadMusica = require("../middlewares/uploadMusica.middleware");

// =============================
// IMPORTAR CONTROLLERS
// =============================
const {
    listarMusica,
    obtenerMusicaPorId,
    crearMusica,
    crearMusicaConAudio,
    editarMusica,
    eliminarMusica,
} = require("../controllers/musica.controller");


// =============================
// LISTAR TODAS LAS CANCIONES
// =============================
router.get(
    "/listar",
    listarMusica
);


// =============================
// OBTENER CANCION POR ID
// =============================
router.get(
    "/obtener/:id",
    obtenerMusicaPorId
);


// =============================
// CREAR MUSICA SIMPLE
// =============================
// crea musica usando body json
router.post(
    "/crear",
    crearMusica
);


// =============================
// CREAR MUSICA CON AUDIO
// =============================
// recibe:
// - titulo
// - letra
// - grupo_id
// - generos_ids
// - audio
//
// guarda:
// /media/musicbh/grupo/canciones/
router.post(
    "/crear-con-audio",
    uploadMusica.single("audio"),
    crearMusicaConAudio
);


// =============================
// ACTUALIZAR MUSICA
// =============================
router.put(
    "/actualizar/:id",
    editarMusica
);


// =============================
// ELIMINAR MUSICA
// =============================
// elimina:
// - playlists relacionadas
// - relaciones generos
// - registro bd
// - archivo mp3 fisico
router.delete(
    "/eliminar/:id",
    eliminarMusica
);


// =============================
// RUTAS ANTIGUAS COMPATIBLES
// =============================
// mantener temporalmente para
// frontend viejo o pruebas.
router.get("/", listarMusica);
router.get("/:id", obtenerMusicaPorId);
router.post("/", crearMusica);
router.put("/:id", editarMusica);
router.delete("/:id", eliminarMusica);


// =============================
// EXPORTAR ROUTER
// =============================
module.exports = router;