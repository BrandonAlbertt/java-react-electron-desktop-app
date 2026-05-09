const multer = require("multer");
const fs = require("fs");
const path = require("path");

const { crearSlug } = require("../utils/slug");

// =============================
// RUTA BASE MEDIA
// =============================
// Dentro de Docker:
// /media
//
// Sin Docker:
// puede usar otra ruta desde .env
const MEDIA_ROOT = process.env.MEDIA_ROOT || "/media";

const storage = multer.diskStorage({

    // =============================
    // DESTINO DEL ARCHIVO
    // =============================
    destination: (req, file, cb) => {

        const nombreGrupo = req.body.nombre;

        const carpetaSlug = crearSlug(nombreGrupo);

        // =============================
        // RUTA FINAL
        // =============================
        const folderPath = path.join(
            MEDIA_ROOT,
            "musicbh",
            carpetaSlug
        );

        // =============================
        // CREAR CARPETA SI NO EXISTE
        // =============================
        fs.mkdirSync(folderPath, {
            recursive: true,
        });

        // guardar slug para usar luego
        req.carpetaSlug = carpetaSlug;

        console.log("📁 Carpeta creada:", folderPath);

        cb(null, folderPath);
    },

    // =============================
    // NOMBRE DEL ARCHIVO
    // =============================
    filename: (req, file, cb) => {

        const extension = path.extname(file.originalname);

        // ejemplo:
        // hecho_de_fuego.jpg
        cb(null, `${req.carpetaSlug}${extension}`);
    },
});

module.exports = multer({
    storage,
});