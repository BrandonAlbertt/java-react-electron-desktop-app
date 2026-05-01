const express = require("express");
const router = express.Router();

// N: Rutas y relación con autenticación
// N: Las rutas públicas (`/` POST y `/login`) permiten registrar y autenticar usuarios.
// N: Las rutas protegidas usan `authMiddleware` que valida el JWT y agrega `req.usuario`.
// N: Los controladores delegan la lógica al `usuario.model` (BD) y a los servicios de hash/token.
const authMiddleware = require("../middlewares/auth.middleware");

const {
    listarUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    editarUsuario,
    eliminarUsuario,
    loginUsuario,
} = require("../controllers/usuario.controller");


// 🔓 PUBLICAS (sin token)
router.post("/", crearUsuario);
router.post("/login", loginUsuario);


// 🔒 PROTEGIDAS (con token)
router.get("/", authMiddleware, listarUsuarios);
router.get("/:id", authMiddleware, obtenerUsuarioPorId);
router.put("/:id", authMiddleware, editarUsuario);
router.delete("/:id", authMiddleware, eliminarUsuario);

module.exports = router;