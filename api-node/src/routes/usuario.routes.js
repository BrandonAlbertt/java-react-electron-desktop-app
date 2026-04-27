const express = require("express");

// Router de usuarios (se conecta en app.js)
const router = express.Router();

const {
    crearUsuario,
} = require("../controllers/usuario.controller");

// En app.js se monta: app.use("/api/usuarios", router)
// Aqui "/" completa la ruta final: POST /api/usuarios
router.post("/", crearUsuario);

// Exporta el router para que app.js lo pueda usar
module.exports = router;