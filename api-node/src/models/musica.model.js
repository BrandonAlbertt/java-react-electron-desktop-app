const db = require("../config/db");

// =============================
// CONSULTAS BASE
// =============================
// aqui viven las consultas de musica.

function mapearMusica(row) {
    if (!row) return null;

    return {
        ...row,
        generos: row.generos ? row.generos.split(",") : [],
        generos_ids: row.generos_ids
            ? row.generos_ids.split(",").map((id) => Number(id))
            : [],
    };
}

// =============================
// GRUPOS
// =============================
// busca el grupo para obtener carpeta_slug.
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

    return rows[0] || null;
}

// =============================
// LISTAR MUSICA
// =============================
// devuelve canciones con grupo y generos.
async function listarMusica() {
    const [rows] = await db.query(`
        SELECT
            m.id,
            m.titulo,
            m.letra,
            m.link_audio,
            m.duracion_segundos,
            m.grupo_id,
            g.nombre AS grupo,
            g.imagen_url AS imagen_grupo,
            g.carpeta_slug AS carpeta_grupo,
            GROUP_CONCAT(DISTINCT gen.nombre ORDER BY gen.nombre SEPARATOR ',') AS generos,
            GROUP_CONCAT(DISTINCT gen.id ORDER BY gen.id SEPARATOR ',') AS generos_ids
        FROM musica m
        INNER JOIN grupos_musicales g ON m.grupo_id = g.id
        LEFT JOIN musica_generos_m mg ON m.id = mg.musica_id
        LEFT JOIN generos_musicales gen ON mg.genero_id = gen.id
        GROUP BY
            m.id, m.titulo, m.letra, m.link_audio,
            m.duracion_segundos, m.grupo_id,
            g.nombre, g.imagen_url, g.carpeta_slug
        ORDER BY m.titulo ASC
    `);

    return rows.map(mapearMusica);
}

// =============================
// OBTENER MUSICA
// =============================
// devuelve una cancion por id.
async function obtenerMusicaPorId(id) {
    const [rows] = await db.query(`
        SELECT
            m.id,
            m.titulo,
            m.letra,
            m.link_audio,
            m.duracion_segundos,
            m.grupo_id,
            g.nombre AS grupo,
            g.imagen_url AS imagen_grupo,
            g.carpeta_slug AS carpeta_grupo,
            GROUP_CONCAT(DISTINCT gen.nombre ORDER BY gen.nombre SEPARATOR ',') AS generos,
            GROUP_CONCAT(DISTINCT gen.id ORDER BY gen.id SEPARATOR ',') AS generos_ids
        FROM musica m
        INNER JOIN grupos_musicales g ON m.grupo_id = g.id
        LEFT JOIN musica_generos_m mg ON m.id = mg.musica_id
        LEFT JOIN generos_musicales gen ON mg.genero_id = gen.id
        WHERE m.id = ?
        GROUP BY
            m.id, m.titulo, m.letra, m.link_audio,
            m.duracion_segundos, m.grupo_id,
            g.nombre, g.imagen_url, g.carpeta_slug
    `, [id]);

    return mapearMusica(rows[0]);
}

// =============================
// CREAR MUSICA
// =============================
// inserta musica y generos en transaccion.
async function crearMusica(data) {
    const {
        titulo,
        letra = "",
        link_audio = null,
        duracion_segundos = null,
        grupo_id,
        generos_ids = [],
    } = data;

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [grupoRows] = await connection.query(`
            SELECT id
            FROM grupos_musicales
            WHERE id = ?
        `, [grupo_id]);

        if (!grupoRows.length) {
            const error = new Error("Grupo musical no encontrado");
            error.statusCode = 404;
            throw error;
        }

        const [result] = await connection.query(`
            INSERT INTO musica
                (titulo, letra, link_audio, duracion_segundos, grupo_id)
            VALUES (?, ?, ?, ?, ?)
        `, [titulo, letra, link_audio, duracion_segundos, grupo_id]);

        const musicaId = result.insertId;

        if (generos_ids.length > 0) {
            const valores = generos_ids.map((generoId) => [musicaId, generoId]);

            await connection.query(`
                INSERT INTO musica_generos_m (musica_id, genero_id)
                VALUES ?
            `, [valores]);
        }

        await connection.commit();

        return obtenerMusicaPorId(musicaId);
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

// =============================
// EDITAR MUSICA
// =============================
// actualiza datos y reemplaza generos.
async function editarMusica(id, data) {
    const {
        titulo,
        letra,
        link_audio,
        duracion_segundos,
        grupo_id,
        generos_ids = [],
    } = data;

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [musicaRows] = await connection.query(`
            SELECT id
            FROM musica
            WHERE id = ?
        `, [id]);

        if (!musicaRows.length) {
            await connection.rollback();
            return null;
        }

        const [grupoRows] = await connection.query(`
            SELECT id
            FROM grupos_musicales
            WHERE id = ?
        `, [grupo_id]);

        if (!grupoRows.length) {
            const error = new Error("Grupo musical no encontrado");
            error.statusCode = 404;
            throw error;
        }

        await connection.query(`
            UPDATE musica
            SET
                titulo = ?,
                letra = ?,
                link_audio = ?,
                duracion_segundos = ?,
                grupo_id = ?
            WHERE id = ?
        `, [titulo, letra, link_audio, duracion_segundos, grupo_id, id]);

        await connection.query(`
            DELETE FROM musica_generos_m
            WHERE musica_id = ?
        `, [id]);

        if (generos_ids.length > 0) {
            const valores = generos_ids.map((generoId) => [id, generoId]);

            await connection.query(`
                INSERT INTO musica_generos_m (musica_id, genero_id)
                VALUES ?
            `, [valores]);
        }

        await connection.commit();

        return obtenerMusicaPorId(id);
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

// =============================
// ELIMINAR MUSICA
// =============================
// borra relaciones y registro principal.
async function eliminarMusica(id) {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        await connection.query(`
            DELETE FROM lista_musica_m
            WHERE musica_id = ?
        `, [id]);

        await connection.query(`
            DELETE FROM musica_generos_m
            WHERE musica_id = ?
        `, [id]);

        const [result] = await connection.query(`
            DELETE FROM musica
            WHERE id = ?
        `, [id]);

        await connection.commit();

        return result.affectedRows > 0;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

// =============================
// EXPORTAR MODEL
// =============================
// funciones usadas por controller y middleware.
module.exports = {
    obtenerGrupoPorId,
    listarMusica,
    obtenerMusicaPorId,
    crearMusica,
    editarMusica,
    eliminarMusica,
};
