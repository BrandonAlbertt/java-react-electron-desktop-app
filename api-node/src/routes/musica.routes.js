// =============================
// RUTAS DE MÚSICA
// =============================
// Flujo:
// app.js
// -> musica.routes.js
// -> musica.controller.js
// -> musica.model.js
// -> base de datos
//
// Prefijo principal: /api/musica
//
// Endpoints (canónicos):
//   GET    /api/musica/listar              -> Listar todas las canciones
//   GET    /api/musica/obtener/:id         -> Obtener canción por ID
//   POST   /api/musica/crear               -> Crear canción (JSON)
//   POST   /api/musica/crear-con-audio     -> Crear canción con archivo audio (form-data: field `audio`)
//   PUT    /api/musica/actualizar/:id     -> Actualizar canción por ID
//   DELETE /api/musica/eliminar/:id       -> Eliminar canción por ID (borra registro y archivo mp3)
//
// Rutas antiguas / alias (compatibilidad):
//   GET    /api/musica                      -> alias a /listar
//   GET    /api/musica/:id                   -> alias a /obtener/:id
//   POST   /api/musica                       -> alias a /crear
//   PUT    /api/musica/:id                   -> alias a /actualizar/:id
//   DELETE /api/musica/:id                   -> alias a /eliminar/:id
//
// Mantener ambos conjuntos facilita compatibilidad con frontend antiguo.
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
// MANEJO DE UPLOAD AUDIO
// =============================
// devuelve errores multer en json.
function subirAudioMusica(req, res, next) {
    uploadMusica.single("audio")(req, res, (error) => {
        if (error) {
            return res.status(400).json({
                mensaje: "Error al subir audio",
                error: error.message,
            });
        }

        next();
    });
}

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
    subirAudioMusica,
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
