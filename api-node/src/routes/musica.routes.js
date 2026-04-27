const express = require("express");

// Router de música (se conecta en app.js)
const router = express.Router();

const {
    listarMusica,
    obtenerMusicaPorId,
} = require("../controllers/musica.controller");

// En app.js se monta: app.use("/api/musica", router)
// Ruta final: GET /api/musica
// Devuelve todas las canciones
router.get("/", listarMusica);

// Ruta final: GET /api/musica/:id
// Devuelve una canción por id
router.get("/:id", obtenerMusicaPorId);

// Exporta el router para que app.js lo pueda usar
module.exports = router;