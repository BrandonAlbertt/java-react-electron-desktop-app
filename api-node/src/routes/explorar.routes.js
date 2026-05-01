const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

const {
    obtenerDatosExplorar,
} = require("../controllers/explorar.controller");

// 🔒 Ruta protegida
router.get("/", authMiddleware, obtenerDatosExplorar);

module.exports = router;