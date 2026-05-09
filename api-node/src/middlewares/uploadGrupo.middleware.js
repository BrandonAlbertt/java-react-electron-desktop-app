const multer = require("multer");
const fs = require("fs");
const path = require("path");

const { crearSlug } = require("../utils/slug");

// =============================
// RUTA BASE MEDIA
// =============================
// ruta principal donde se guardan
// imagenes y canciones.
//
// docker:
// /media
//
// local:
// usa MEDIA_ROOT desde .env
const MEDIA_ROOT = process.env.MEDIA_ROOT || "/media";
const IMAGE_MIME_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
]);

// =============================
// CONFIGURACION STORAGE MULTER
// =============================
// multer controla:
// - donde guardar archivos
// - nombre del archivo
const storage = multer.diskStorage({

    // =============================
    // DESTINO DEL ARCHIVO
    // =============================
    // crea automaticamente:
    //
    // /media/musicbh/nombre_grupo/
    //
    // y tambien:
    //
    // /media/musicbh/nombre_grupo/canciones/
    destination: (req, file, cb) => {

        // nombre enviado desde frontend
        const nombreGrupo = req.body.nombre;

        if (!nombreGrupo || !nombreGrupo.trim()) {
            return cb(new Error("El nombre del grupo es obligatorio"));
        }

        // convertir:
        // "Hecho de Fuego"
        // ->
        // "hecho_de_fuego"
        const carpetaSlug = crearSlug(nombreGrupo);

        if (!carpetaSlug) {
            return cb(new Error("El nombre del grupo no genera una carpeta valida"));
        }

        // =============================
        // CARPETA PRINCIPAL DEL GRUPO
        // =============================
        const folderPath = path.join(
            MEDIA_ROOT,
            "musicbh",
            carpetaSlug
        );

        // crear carpeta principal
        fs.mkdirSync(folderPath, {
            recursive: true,
        });

        // =============================
        // CARPETA DE CANCIONES
        // =============================
        const cancionesPath = path.join(
            folderPath,
            "canciones"
        );

        // crear carpeta canciones
        fs.mkdirSync(cancionesPath, {
            recursive: true,
        });

        // guardar slug temporalmente
        // para usarlo luego en filename
        req.carpetaSlug = carpetaSlug;

        console.log("📁 Carpeta grupo:", folderPath);
        console.log("🎵 Carpeta canciones:", cancionesPath);

        // indicar a multer donde guardar
        cb(null, folderPath);
    },

    // =============================
    // NOMBRE DEL ARCHIVO
    // =============================
    // renombra la imagen usando
    // el nombre del grupo.
    //
    // ejemplo:
    // hecho_de_fuego.jpg
    filename: (req, file, cb) => {

        // obtener extension original
        const extension = path.extname(
            file.originalname
        );

        // nombre final
        cb(
            null,
            `${req.carpetaSlug}${extension}`
        );
    },
});

// =============================
// EXPORTAR MIDDLEWARE
// =============================
// este middleware sera usado
// en grupo.routes.js
module.exports = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (!IMAGE_MIME_TYPES.has(file.mimetype)) {
            return cb(new Error("Solo se permiten imagenes JPG, PNG o WEBP"));
        }

        cb(null, true);
    },
});
