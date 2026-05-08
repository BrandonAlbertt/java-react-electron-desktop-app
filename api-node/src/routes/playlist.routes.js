const express = require("express");

// Router de playlists (se conecta en app.js)
const router = express.Router();

const {
    renombrarLista,
    crearLista,
    listarListasPorUsuario,
    agregarCancionALista,
    quitarCancionDeLista,
    eliminarLista,
} = require("../controllers/playlist.controller");


// Ruta final: PUT /api/listas/:listaId
// Renombra una lista existente
router.put("/listas/:listaId", renombrarLista);
// En app.js se monta: app.use("/api", playlistRoutes)
// Ruta final: POST /api/usuarios/:usuarioId/listas
// Crea una nueva lista para un usuario
router.post("/usuarios/:usuarioId/listas", crearLista);

// Ruta final: GET /api/usuarios/:usuarioId/listas
// Lista las playlists de un usuario
router.get("/usuarios/:usuarioId/listas", listarListasPorUsuario);

// Ruta final: POST /api/listas/:listaId/canciones/:musicaId
// Agrega una canción a una lista
router.post("/listas/:listaId/canciones/:musicaId", agregarCancionALista);

// Ruta final: DELETE /api/listas/:listaId/canciones/:musicaId
// Quita una canción de una lista
router.delete("/listas/:listaId/canciones/:musicaId", quitarCancionDeLista);

// Ruta final: DELETE /api/listas/:listaId
// Elimina una lista completa
router.delete("/listas/:listaId", eliminarLista);

// Exporta el router para que app.js lo pueda usar
module.exports = router;