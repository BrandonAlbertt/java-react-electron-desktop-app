const db = require("../config/db");

// Model:
// aqui viven todas las consultas SQL relacionadas
// con grupos musicales y eliminacion relacionada.
//
// flujo:
// controller -> model -> base de datos

// =============================
// LISTAR TODOS LOS GRUPOS
// =============================
// obtiene todos los grupos musicales
// ordenados por id
async function listarGrupos() {

    const [rows] = await db.query(`
        SELECT
            id,
            imagen_url,
            nombre,
            carpeta_slug
        FROM grupos_musicales
        ORDER BY id ASC
    `);

    return rows;
}

// =============================
// OBTENER GRUPO POR ID
// =============================
// devuelve un solo grupo
async function obtenerGrupoPorId(id) {

    const [rows] = await db.query(`
        SELECT
            id,
            imagen_url,
            nombre,
            carpeta_slug
        FROM grupos_musicales
        WHERE id = ?
    `, [id]);

    return rows[0];
}

// =============================
// CREAR GRUPO
// =============================
// inserta un nuevo grupo musical
async function crearGrupo(
    imagen_url,
    nombre,
    carpeta_slug
) {

    const [result] = await db.query(`
        INSERT INTO grupos_musicales (
            imagen_url,
            nombre,
            carpeta_slug
        )
        VALUES (?, ?, ?)
    `, [
        imagen_url,
        nombre,
        carpeta_slug,
    ]);

    return {
        id: result.insertId,
        imagen_url,
        nombre,
        carpeta_slug,
    };
}

// =============================
// ACTUALIZAR GRUPO
// =============================
// actualiza informacion de grupo
async function actualizarGrupo(
    id,
    imagen_url,
    nombre,
    carpeta_slug
) {

    await db.query(`
        UPDATE grupos_musicales
        SET
            imagen_url = ?,
            nombre = ?,
            carpeta_slug = ?
        WHERE id = ?
    `, [
        imagen_url,
        nombre,
        carpeta_slug,
        id,
    ]);

    return {
        id,
        imagen_url,
        nombre,
        carpeta_slug,
    };
}

// =============================
// ELIMINAR GRUPO
// =============================
// elimina un grupo por id
async function eliminarGrupo(id) {

    const [result] = await db.query(`
        DELETE FROM grupos_musicales
        WHERE id = ?
    `, [id]);

    return result.affectedRows;
}

// =============================
// LISTAR MUSICAS POR GRUPO
// =============================
// obtiene ids de canciones
// pertenecientes a un grupo
async function listarMusicasPorGrupo(grupoId) {

    const [rows] = await db.query(`
        SELECT
            id
        FROM musica
        WHERE grupo_id = ?
    `, [grupoId]);

    return rows;
}

// =============================
// ELIMINAR RELACIONES LISTAS
// =============================
// elimina canciones de playlists
async function eliminarRelacionesListasPorMusicas(idsMusicas) {

    // evitar error si no hay ids
    if (!idsMusicas.length) {
        return 0;
    }

    const [result] = await db.query(`
        DELETE FROM lista_musica_m
        WHERE musica_id IN (?)
    `, [idsMusicas]);

    return result.affectedRows;
}

// =============================
// ELIMINAR RELACIONES GENEROS
// =============================
// elimina relaciones entre
// canciones y generos
async function eliminarRelacionesGenerosPorMusicas(idsMusicas) {

    if (!idsMusicas.length) {
        return 0;
    }

    const [result] = await db.query(`
        DELETE FROM musica_generos_m
        WHERE musica_id IN (?)
    `, [idsMusicas]);

    return result.affectedRows;
}

// =============================
// ELIMINAR MUSICAS DEL GRUPO
// =============================
// elimina canciones relacionadas
// a un grupo musical
async function eliminarMusicasPorGrupo(grupoId) {

    const [result] = await db.query(`
        DELETE FROM musica
        WHERE grupo_id = ?
    `, [grupoId]);

    return result.affectedRows;
}

// =============================
// ELIMINAR GRUPO COMPLETO
// =============================
// elimina relaciones, canciones y grupo
// dentro de una misma transaccion.
async function eliminarGrupoCompleto(grupoId) {

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [musicas] = await connection.query(`
            SELECT
                id
            FROM musica
            WHERE grupo_id = ?
        `, [grupoId]);

        const idsMusicas = musicas.map((musica) => musica.id);

        let relacionesListasEliminadas = 0;
        let relacionesGenerosEliminadas = 0;

        if (idsMusicas.length) {
            const [resultListas] = await connection.query(`
                DELETE FROM lista_musica_m
                WHERE musica_id IN (?)
            `, [idsMusicas]);

            relacionesListasEliminadas = resultListas.affectedRows;

            const [resultGeneros] = await connection.query(`
                DELETE FROM musica_generos_m
                WHERE musica_id IN (?)
            `, [idsMusicas]);

            relacionesGenerosEliminadas = resultGeneros.affectedRows;
        }

        const [resultMusicas] = await connection.query(`
            DELETE FROM musica
            WHERE grupo_id = ?
        `, [grupoId]);

        const [resultGrupo] = await connection.query(`
            DELETE FROM grupos_musicales
            WHERE id = ?
        `, [grupoId]);

        await connection.commit();

        return {
            grupo_eliminado: resultGrupo.affectedRows,
            musicas_eliminadas: resultMusicas.affectedRows,
            relaciones_eliminadas: {
                listas: relacionesListasEliminadas,
                generos: relacionesGenerosEliminadas,
            },
        };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

// =============================
// EXPORTAR FUNCIONES
// =============================
// estas funciones seran usadas
// por grupo.controller.js
module.exports = {
    listarGrupos,
    obtenerGrupoPorId,
    crearGrupo,
    actualizarGrupo,
    eliminarGrupo,

    listarMusicasPorGrupo,
    eliminarRelacionesListasPorMusicas,
    eliminarRelacionesGenerosPorMusicas,
    eliminarMusicasPorGrupo,
    eliminarGrupoCompleto,
};
