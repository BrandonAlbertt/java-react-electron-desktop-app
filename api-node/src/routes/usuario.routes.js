// RUTAS DE USUARIOS
// Relacion: app.js -> usuario.routes.js -> usuario.controller.js -> usuario.model.js
// Este archivo solo define las rutas; la logica vive en el controller

const express = require("express");

const router = express.Router();

const {
    listarUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    editarUsuario,
    eliminarUsuario,
    loginUsuario,
} = require("../controllers/usuario.controller");

// GET /api/usuarios - Lista todos los usuarios
router.get("/", listarUsuarios);

// GET /api/usuarios/:id - Busca un usuario por ID
router.get("/:id", obtenerUsuarioPorId);

// POST /api/usuarios - Crea un usuario nuevo
// En Postman:
//   Method: POST
//   URL: http://localhost:3000/api/usuarios
//   Body -> raw -> JSON
//   {
//     "avatar_id": 1,
//     "nombre_usuario": "Juan",
//     "email": "juan@mail.com",
//     "contrasena": "123456"
//   }
router.post("/", crearUsuario);

// PUT /api/usuarios/:id - Edita un usuario existente
router.put("/:id", editarUsuario);

// DELETE /api/usuarios/:id - Elimina un usuario
router.delete("/:id", eliminarUsuario);

// POST /api/usuarios/login - Busca usuario por email
// En Postman:
//   Method: POST
//   URL: http://localhost:3000/api/usuarios/login
//   Body -> raw -> JSON
//   {
//     "email": "juan@mail.com"
//   }
// Responde con el usuario completo (incluyendo contraseña).
// El frontend compara la contraseña internamente.
router.post("/login", loginUsuario);

module.exports = router;