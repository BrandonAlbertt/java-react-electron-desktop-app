// RUTAS DE MUSICA
// Relacion: app.js -> musica.routes.js -> musica.controller.js -> musica.model.js
// Este archivo define las subrutas, el controller maneja la logica

const express = require("express");
const router = express.Router();

const {
    listarMusica,
    obtenerMusicaPorId,
    crearMusica,
    editarMusica,
    eliminarMusica,
} = require("../controllers/musica.controller");

// GET /api/musica - Listar todas las canciones
router.get("/", listarMusica);

// GET /api/musica/:id - Obtener cancion por ID
router.get("/:id", obtenerMusicaPorId);

// POST /api/musica - Crear cancion (enviar JSON en body)
router.post("/", crearMusica);

// PUT /api/musica/:id - Editar cancion (enviar JSON en body)
router.put("/:id", editarMusica);

// DELETE /api/musica/:id - Eliminar cancion
router.delete("/:id", eliminarMusica);

module.exports = router;