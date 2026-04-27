// Conexión al pool de MySQL (configurada en src/config/db.js)
const db = require("../config/db");

// Inserta un nuevo usuario en la tabla `usuarios`.
// Parámetros: objeto con { avatar_id, nombre_usuario, email, contrasena }.
// Retorna: el id del registro insertado (insertId).
// Uso: llamado desde `usuario.controller.crearUsuario` cuando ya se validó el email.
async function crearUsuario({ avatar_id, nombre_usuario, email, contrasena }) {
    const [result] = await db.query(`
        INSERT INTO usuarios (
            avatar_id,
            nombre_usuario,
            email,
            contrasena
        )
        VALUES (?, ?, ?, ?)
    `, [avatar_id, nombre_usuario, email, contrasena]);

    return result.insertId;
}

// Busca un usuario por su email.
// Parámetros: email (string).
// Retorna: la primera fila encontrada o undefined si no existe.
// Propósito principal: evitar registros duplicados por email (comprobación previa).
// Uso: `usuario.controller.crearUsuario` llama a esta función antes de insertar.
async function buscarUsuarioPorEmail(email) {
    const [rows] = await db.query(`
        SELECT
            id,
            email
        FROM usuarios
        WHERE email = ?
    `, [email]);

    return rows[0];
}

module.exports = {
    crearUsuario,
    buscarUsuarioPorEmail,
};