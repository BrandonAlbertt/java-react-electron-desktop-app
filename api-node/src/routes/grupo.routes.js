const express = require("express");

const uploadGrupo = require("../middlewares/uploadGrupo.middleware");
const GrupoController = require("../controllers/grupo.controller");

const router = express.Router();

// ======================================================
// RUTAS GRUPOS MUSICALES
// ======================================================
// flujo:
//
// routes
// -> controller
// -> model
// -> base de datos
//
// prefijo principal:
// /api/grupos-musicales
//
// ejemplos finales:
//
// GET    /api/grupos-musicales/listar
// GET    /api/grupos-musicales/obtener/1
// POST   /api/grupos-musicales/crear
// POST   /api/grupos-musicales/crear-con-imagen
// PUT    /api/grupos-musicales/actualizar/1
// DELETE /api/grupos-musicales/eliminar/1
// ======================================================


// =============================
// LISTAR TODOS LOS GRUPOS
// =============================
// devuelve todos los grupos musicales
router.get(
    "/listar",
    GrupoController.listarGrupos
);


// =============================
// OBTENER GRUPO POR ID
// =============================
// ejemplo:
// /obtener/1
router.get(
    "/obtener/:id",
    GrupoController.obtenerGrupoPorId
);


// =============================
// CREAR GRUPO SIMPLE
// =============================
// crea grupo usando body json
router.post(
    "/crear",
    GrupoController.crearGrupo
);


// =============================
// CREAR GRUPO CON IMAGEN
// =============================
// recibe:
// - nombre
// - imagen
//
// crea:
// carpeta del grupo
// carpeta canciones
// imagen del grupo
router.post(
    "/crear-con-imagen",
    uploadGrupo.single("imagen"),
    GrupoController.crearGrupoConImagen
);


// =============================
// ACTUALIZAR GRUPO
// =============================
// actualiza informacion de grupo
router.put(
    "/actualizar/:id",
    GrupoController.actualizarGrupo
);


// =============================
// ELIMINAR GRUPO COMPLETO
// =============================
// elimina:
// - grupo
// - canciones relacionadas
// - relaciones listas
// - relaciones generos
// - carpeta fisica
router.delete(
    "/eliminar/:id",
    GrupoController.eliminarGrupo
);


// =============================
// EXPORTAR ROUTER
// =============================
module.exports = router;