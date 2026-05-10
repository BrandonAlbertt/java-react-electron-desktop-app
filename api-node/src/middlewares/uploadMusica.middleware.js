const multer = require("multer");
const fs = require("fs");
const path = require("path");

const GrupoModel = require("../models/grupo.model");
const { crearSlug } = require("../utils/slug");

const MEDIA_ROOT = process.env.MEDIA_ROOT || "/media";

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            const grupoId = req.body.grupo_id;

            const grupo = await GrupoModel.obtenerGrupoPorId(grupoId);

            if (!grupo) {
                return cb(new Error("Grupo no encontrado"));
            }

            if (!grupo.carpeta_slug) {
                return cb(new Error("El grupo no tiene carpeta_slug"));
            }

            const folderPath = path.join(
                MEDIA_ROOT,
                "musicbh",
                grupo.carpeta_slug,
                "canciones"
            );

            fs.mkdirSync(folderPath, {
                recursive: true,
            });

            req.grupo = grupo;

            cb(null, folderPath);
        } catch (error) {
            cb(error);
        }
    },

    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const tituloSlug = crearSlug(req.body.titulo || "cancion");

        cb(null, `${tituloSlug}${extension}`);
    },
});

module.exports = multer({
    storage,
});