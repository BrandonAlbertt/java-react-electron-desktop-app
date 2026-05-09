const path = require("path");
const multer = require("multer");

// =============================
// CONFIGURACION AUDIO
// =============================
// multer lee el archivo y el controller lo guarda.
const AUDIO_MIME_TYPES = new Set([
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/x-wav",
    "audio/mp4",
    "audio/m4a",
    "audio/aac",
    "audio/ogg",
    "audio/webm",
]);

const AUDIO_EXTENSIONS = new Set([
    ".mp3",
    ".wav",
    ".m4a",
    ".aac",
    ".ogg",
    ".webm",
]);

// =============================
// EXPORTAR MIDDLEWARE
// =============================
// memoryStorage evita depender del orden del form-data.
module.exports = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 30 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();

        if (!AUDIO_MIME_TYPES.has(file.mimetype) && !AUDIO_EXTENSIONS.has(extension)) {
            return cb(new Error("Solo se permiten audios MP3, WAV, M4A, AAC, OGG o WEBM"));
        }

        cb(null, true);
    },
});
