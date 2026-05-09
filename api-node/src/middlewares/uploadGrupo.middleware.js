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

        // convertir:
        // "Hecho de Fuego"
        // ->
        // "hecho_de_fuego"
        const carpetaSlug = crearSlug(nombreGrupo);

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
});