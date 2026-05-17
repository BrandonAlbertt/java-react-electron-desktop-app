const multer = require("multer");

// Para canciones usamos memoria, no disco.
// El controlador guarda el archivo despues de validar el grupo y antes de insertar en BD.
// Asi evitamos dejar MP3 fisicos sin registro si falla la insercion.
module.exports = multer({
    storage: multer.memoryStorage(),
});
