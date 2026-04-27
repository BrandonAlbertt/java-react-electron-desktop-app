const express = require("express");

// Router de avatares: define endpoints relacionados con avatares.
// En `app.js` se monta con: app.use('/api/avatares', avatarRoutes)
// Rutas finales:
// - GET    /api/avatares             -> listar todos
// - GET    /api/avatares/:id         -> obtener uno por id
// - POST   /api/avatares             -> crear (body JSON)
// - PUT    /api/avatares/:id         -> actualizar (body JSON)
// - DELETE /api/avatares/:id         -> eliminar

const router = express.Router();

const AvatarController = require("../controllers/avatar.controller");

// Lista todos los avatares (se puede abrir en navegador)
router.get("/", AvatarController.listarAvatares);

// Obtiene un avatar por su id (ejemplo: /api/avatares/1)
router.get("/:id", AvatarController.obtenerAvatarPorId);

// Crea un avatar. En Postman enviar JSON:
// { "imagen_url": "https://...", "nombre": "Guitarrista" }
router.post("/", AvatarController.crearAvatar);

// Actualiza un avatar por id. En Postman enviar JSON como arriba.
router.put("/:id", AvatarController.actualizarAvatar);

// Elimina un avatar por id
router.delete("/:id", AvatarController.eliminarAvatar);

module.exports = router;