const express = require("express");

// Router de grupos musicales.
// Relación entre archivos (sencillo):
// app.js -> app.use('/api/grupos-musicales', grupoRoutes) -> grupo.routes.js
// -> controllers/grupo.controller.js -> models/grupo.model.js -> config/db.js
// Esto significa que cuando alguien llama a /api/grupos-musicales el flujo
// pasa por las rutas, luego al controller (logica) y este usa el model
// para leer/escribir en la base de datos.
// Rutas finales disponibles:
// - GET    /api/grupos-musicales        => listar todos los grupos
// - GET    /api/grupos-musicales/:id    => obtener grupo por id
// - POST   /api/grupos-musicales        => crear grupo (body JSON)
// - PUT    /api/grupos-musicales/:id    => actualizar grupo (body JSON)
// - DELETE /api/grupos-musicales/:id    => eliminar grupo

const router = express.Router();

const GrupoController = require("../controllers/grupo.controller");

// Lista todos los grupos. Puedes abrirlo en el navegador:
// http://localhost:3000/api/grupos-musicales
router.get("/", GrupoController.listarGrupos);

// Obtiene un grupo por id. Ejemplo: /api/grupos-musicales/1
router.get("/:id", GrupoController.obtenerGrupoPorId);

// Crea un grupo. Ejemplo de body en Postman (JSON, Content-Type: application/json):
// {
//   "imagen_url": "https://example.com/imagen.jpg",
//   "nombre": "Nombre del grupo"
// }
router.post("/", GrupoController.crearGrupo);

// Actualiza un grupo (en Postman usar PUT y enviar JSON igual que arriba).
router.put("/:id", GrupoController.actualizarGrupo);

// Elimina un grupo por id
router.delete("/:id", GrupoController.eliminarGrupo);

module.exports = router;