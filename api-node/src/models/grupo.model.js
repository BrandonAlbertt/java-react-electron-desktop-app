const db = require("../config/db");

// Model: aquí están las consultas SQL que acceden a la base de datos.
// Nota para no-programadores: el controller llama a estas funciones.
// Ejemplo de flujo: controller.crearGrupo() -> model.crearGrupo() -> db.query(SQL)

async function listarGrupos() {
    const [rows] = await db.query(`
        SELECT
            id,
            imagen_url,
            nombre
        FROM grupos_musicales
        ORDER BY id ASC
    `);

    // `rows` es un array con las filas devueltas por la consulta.
    return rows;
}

async function obtenerGrupoPorId(id) {
    const [rows] = await db.query(`
        SELECT
            id,
            imagen_url,
            nombre
        FROM grupos_musicales
        WHERE id = ?
    `, [id]);

    // Retornamos la primera fila (o undefined si no existe)
    return rows[0];
}

async function crearGrupo(imagen_url, nombre) {
    const [result] = await db.query(`
        INSERT INTO grupos_musicales (
            imagen_url,
            nombre
        )
        VALUES (?, ?)
    `, [imagen_url, nombre]);

    // `result.insertId` es el id creado por la base de datos.
    return {
        id: result.insertId,
        imagen_url,
        nombre,
    };
}

async function actualizarGrupo(id, imagen_url, nombre) {
    await db.query(`
        UPDATE grupos_musicales
        SET
            imagen_url = ?,
            nombre = ?
        WHERE id = ?
    `, [imagen_url, nombre, id]);

    // Devolvemos el objeto con los nuevos valores (útil para el controller)
    return {
        id,
        imagen_url,
        nombre,
    };
}

async function eliminarGrupo(id) {
    const [result] = await db.query(`
        DELETE FROM grupos_musicales
        WHERE id = ?
    `, [id]);

    // `result.affectedRows` indica cuántas filas fueron borradas (0 o 1).
    return result.affectedRows;
}

module.exports = {
    listarGrupos,
    obtenerGrupoPorId,
    crearGrupo,
    actualizarGrupo,
    eliminarGrupo,
};