const express = require("express");

// Router de géneros musicales.
// Relación entre archivos (fácil):
// app.js -> app.use('/api/generos-musicales', generoRoutes)
// -> src/routes/genero.routes.js -> controllers/genero.controller.js
// -> models/genero.model.js -> config/db.js
// Así, una petición HTTP viaja por esos archivos hasta la base de datos.

const router = express.Router();

const GeneroController = require("../controllers/genero.controller");

// Rutas disponibles:
// - GET    /api/generos-musicales        => listar géneros (ver en navegador)
// - GET    /api/generos-musicales/:id    => obtener un género por id
// - POST   /api/generos-musicales        => crear género (body JSON)
// - PUT    /api/generos-musicales/:id    => actualizar género (body JSON)
// - DELETE /api/generos-musicales/:id    => eliminar género

router.get("/", GeneroController.listarGeneros);
router.get("/:id", GeneroController.obtenerGeneroPorId);

// Crear género: en Postman -> POST -> Body: raw JSON
// Ejemplo body:
// { "nombre": "Rock" }
router.post("/", GeneroController.crearGenero);

// Actualizar género: usar PUT y enviar JSON igual al ejemplo anterior.
router.put("/:id", GeneroController.actualizarGenero);
router.delete("/:id", GeneroController.eliminarGenero);

module.exports = router;