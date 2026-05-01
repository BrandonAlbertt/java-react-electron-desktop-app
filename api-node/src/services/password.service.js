const bcrypt = require("bcrypt");

// N: Servicio de contraseñas
// N: Este módulo encapsula el uso de bcrypt para:
// N: - `hashPassword`: hashear contraseñas antes de guardarlas en la BD
// N: - `comparePassword`: comparar una contraseña en claro con el hash guardado
// N: SALT_ROUNDS controla el coste computacional del hash; aumentar => más seguro pero más lento
const SALT_ROUNDS = 10;

// N: Convierte contraseña normal en hash seguro usando bcrypt
async function hashPassword(contrasena) {
    return await bcrypt.hash(contrasena, SALT_ROUNDS);
}

// N: Compara contraseña escrita con hash guardado en BD (devuelve boolean)
async function comparePassword(contrasenaPlano, contrasenaHash) {
    return await bcrypt.compare(contrasenaPlano, contrasenaHash);
}

module.exports = {
    hashPassword,
    comparePassword,
};