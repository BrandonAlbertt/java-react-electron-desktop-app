const express = require("express");
const uploadGrupo = require("../middlewares/uploadGrupo.middleware");
const GrupoController = require("../controllers/grupo.controller");

const router = express.Router();

function subirImagenGrupo(req, res, next) {
    uploadGrupo.single("imagen")(req, res, (error) => {
        if (error) {
            return res.status(400).json({
                mensaje: error.message,
            });
        }

        next();
    });
}

// =============================
// RUTA PARA SUBIR IMAGEN Y CREAR GRUPO
// =============================
// IMPORTANTE:
// Las rutas con texto fijo van antes de "/:id" para que Express no las confunda
// con ids. Se mantienen aliases descriptivos y rutas REST para no romper clientes.
router.post(
    "/crear-con-imagen",
    subirImagenGrupo,
    GrupoController.crearGrupoConImagen
);

router.post(
    "/upload",
    subirImagenGrupo,
    GrupoController.crearGrupoConImagen
);

// =============================
// RUTAS DESCRIPTIVAS
// =============================
router.get("/listar", GrupoController.listarGrupos);
router.get("/obtener/:id", GrupoController.obtenerGrupoPorId);
router.post("/crear", GrupoController.crearGrupo);
router.put("/actualizar/:id", GrupoController.actualizarGrupo);
router.delete("/eliminar/:id", GrupoController.eliminarGrupo);

// =============================
// RUTAS REST
// =============================
router.get("/", GrupoController.listarGrupos);
router.get("/:id", GrupoController.obtenerGrupoPorId);
router.post("/", GrupoController.crearGrupo);
router.put("/:id", GrupoController.actualizarGrupo);
router.delete("/:id", GrupoController.eliminarGrupo);

module.exports = router;
