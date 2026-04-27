const express = require("express");

// Router de biblioteca (se conecta en app.js)
const router = express.Router();

const {
    obtenerBiblioteca,
} = require("../controllers/biblioteca.controller");

// En app.js se monta: app.use("/api", router)
// Aqui se completa la ruta final: GET /api/usuarios/:id/biblioteca
// Ejemplo: GET /api/usuarios/1/biblioteca
router.get("/usuarios/:id/biblioteca", obtenerBiblioteca);

// Exporta el router para que app.js lo pueda usar
module.exports = router;