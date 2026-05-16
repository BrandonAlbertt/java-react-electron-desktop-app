const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

const {
    listarUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    editarUsuario,
    eliminarUsuario,
    loginUsuario,
} = require("../controllers/usuario.controller");

// RUTAS PUBLICAS
// Registro y login NO usan authMiddleware porque el usuario todavia no tiene token.
// Estas rutas son las encargadas de crear o entregar el JWT.
router.post("/", crearUsuario);
router.post("/login", loginUsuario);

// RUTAS PRIVADAS
// Desde aqui cada endpoint requiere Authorization: Bearer <token>.
router.get("/", authMiddleware, listarUsuarios);
router.get("/:id", authMiddleware, obtenerUsuarioPorId);
router.put("/:id", authMiddleware, editarUsuario);
router.delete("/:id", authMiddleware, eliminarUsuario);

module.exports = router;
