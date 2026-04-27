const express = require("express");

// Router de explorar (se conecta en app.js)
const router = express.Router();

const {
    obtenerDatosExplorar,
} = require("../controllers/explorar.controller");

// En app.js se monta: app.use("/api/explorar", router)
// Aqui "/" completa la ruta final: GET /api/explorar
router.get("/", obtenerDatosExplorar);

// Exporta el router para que app.js lo pueda usar
module.exports = router;