const express = require("express");
const uploadGrupo = require("../middlewares/uploadGrupo.middleware");
const GrupoController = require("../controllers/grupo.controller");

const router = express.Router();

// =============================
// RUTA PARA SUBIR IMAGEN Y CREAR GRUPO
// =============================
// IMPORTANTE: va antes de "/:id" para que Express no confunda "upload" con un id.
router.post(
    "/upload",
    uploadGrupo.single("imagen"),
    GrupoController.crearGrupoConImagen
);

// =============================
// RUTAS NORMALES
// =============================
router.get("/", GrupoController.listarGrupos);
router.get("/:id", GrupoController.obtenerGrupoPorId);
router.post("/", GrupoController.crearGrupo);
router.put("/:id", GrupoController.actualizarGrupo);
router.delete("/:id", GrupoController.eliminarGrupo);

module.exports = router;