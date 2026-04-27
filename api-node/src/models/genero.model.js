const db = require("../config/db");

// Model de géneros: aquí están las consultas SQL.
// Nota para principiantes: el controller llama a estas funciones.

async function listarGeneros() {
    const [rows] = await db.query(`
        SELECT
            id,
            nombre
        FROM generos_musicales
        ORDER BY id ASC
    `);

    // `rows` es un array con los géneros retornados.
    return rows;
}

async function obtenerGeneroPorId(id) {
    const [rows] = await db.query(`
        SELECT
            id,
            nombre
        FROM generos_musicales
        WHERE id = ?
    `, [id]);

    // devolvemos la primera fila (o undefined si no existe)
    return rows[0];
}

async function crearGenero(nombre) {
    const [result] = await db.query(`
        INSERT INTO generos_musicales (
            nombre
        )
        VALUES (?)
    `, [nombre]);

    return {
        id: result.insertId,
        nombre,
    };
}

async function actualizarGenero(id, nombre) {
    await db.query(`
        UPDATE generos_musicales
        SET
            nombre = ?
        WHERE id = ?
    `, [nombre, id]);

    return {
        id,
        nombre,
    };
}

async function eliminarGenero(id) {
    const [result] = await db.query(`
        DELETE FROM generos_musicales
        WHERE id = ?
    `, [id]);

    // result.affectedRows -> 1 si se borró, 0 si no existía
    return result.affectedRows;
}

module.exports = {
    listarGeneros,
    obtenerGeneroPorId,
    crearGenero,
    actualizarGenero,
    eliminarGenero,
};