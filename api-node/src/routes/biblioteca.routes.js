const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

const {
    obtenerBiblioteca,
} = require("../controllers/biblioteca.controller");

// 🔒 Ruta protegida
router.get("/usuarios/:id/biblioteca", authMiddleware, obtenerBiblioteca);

module.exports = router;