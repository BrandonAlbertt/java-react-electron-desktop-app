// Conexión al pool de MySQL (configurada en src/config/db.js)
const db = require("../config/db");

// Obtiene todos los avatares ordenados por id.
// Uso: llamado desde avatar.controller.listarAvatares()
async function listarAvatares() {
    const [rows] = await db.query(`
        SELECT
            id,
            imagen_url,
            nombre
        FROM avatares
        ORDER BY id ASC
    `);

    return rows;
}

// Obtiene un avatar por su id.
// Uso: avatar.controller.obtenerAvatarPorId(id)
async function obtenerAvatarPorId(id) {
    const [rows] = await db.query(`
        SELECT
            id,
            imagen_url,
            nombre
        FROM avatares
        WHERE id = ?
    `, [id]);

    return rows[0];
}

// Inserta un nuevo avatar y retorna el objeto creado (incluye id).
// Uso: avatar.controller.crearAvatar(imagen_url, nombre)
async function crearAvatar(imagen_url, nombre) {
    const [result] = await db.query(`
        INSERT INTO avatares (
            imagen_url,
            nombre
        )
        VALUES (?, ?)
    `, [imagen_url, nombre]);

    return {
        id: result.insertId,
        imagen_url,
        nombre
    };
}

// Actualiza los campos de un avatar y devuelve el objeto actualizado.
// Uso: avatar.controller.actualizarAvatar(id, imagen_url, nombre)
async function actualizarAvatar(id, imagen_url, nombre) {
    await db.query(`
        UPDATE avatares
        SET
            imagen_url = ?,
            nombre = ?
        WHERE id = ?
    `, [imagen_url, nombre, id]);

    return {
        id,
        imagen_url,
        nombre
    };
}

// Elimina un avatar por id. Retorna el número de filas afectadas (0 o 1).
// Uso: avatar.controller.eliminarAvatar(id)
async function eliminarAvatar(id) {
    const [result] = await db.query(`
        DELETE FROM avatares
        WHERE id = ?
    `, [id]);

    return result.affectedRows;
}

module.exports = {
    listarAvatares,
    obtenerAvatarPorId,
    crearAvatar,
    actualizarAvatar,
    eliminarAvatar,
};