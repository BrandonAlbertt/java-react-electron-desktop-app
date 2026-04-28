const db = require("../config/db");

/*
|--------------------------------------------------------------------------
| MODEL DE MUSICA - RELACION CON BD
|--------------------------------------------------------------------------
| Relacion: controller -> model -> BD
| El model hace SELECT/INSERT/UPDATE/DELETE en la BD
| 
| Tablas involucradas:
|   1. musica (columnas: id, titulo, letra, link_audio, duracion_segundos, grupo_id)
|   2. grupos_musicales (FK: grupo_id en musica)
|   3. musica_generos_m (tabla relacion: musica_id, genero_id)
|   4. generos_musicales (FK: genero_id en musica_generos_m)
|   5. lista_musica_m (canciones en playlists, usa musica_id)
|
| Flujo de datos:
|   req.body (JSON) -> controller -> model -> BD -> obtenerMusicaPorId -> response JSON
|--------------------------------------------------------------------------
*/

// Listar todas las canciones con sus generos y grupo
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
            GROUP_CONCAT(gen.nombre ORDER BY gen.nombre SEPARATOR ',') AS generos
        FROM musica m
        INNER JOIN grupos_musicales g ON m.grupo_id = g.id
        LEFT JOIN musica_generos_m mg ON m.id = mg.musica_id
        LEFT JOIN generos_musicales gen ON mg.genero_id = gen.id
        GROUP BY
            m.id, m.titulo, m.letra, m.link_audio,
            m.duracion_segundos, m.grupo_id, g.nombre, g.imagen_url
        ORDER BY m.titulo ASC
    `);

    return rows.map((item) => ({
        ...item,
        generos: item.generos ? item.generos.split(",") : [],
    }));
}

// Obtener una cancion por ID con sus generos y grupo
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
            GROUP_CONCAT(gen.nombre ORDER BY gen.nombre SEPARATOR ',') AS generos
        FROM musica m
        INNER JOIN grupos_musicales g ON m.grupo_id = g.id
        LEFT JOIN musica_generos_m mg ON m.id = mg.musica_id
        LEFT JOIN generos_musicales gen ON mg.genero_id = gen.id
        WHERE m.id = ?
        GROUP BY
            m.id, m.titulo, m.letra, m.link_audio,
            m.duracion_segundos, m.grupo_id, g.nombre, g.imagen_url
    `, [id]);

    const musica = rows[0];

    if (!musica) return null;

    return {
        ...musica,
        generos: musica.generos ? musica.generos.split(",") : [],
    };
}

// Crear cancion con transaccion: INSERT musica + INSERT generos
async function crearMusica(data) {
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
        // Inicia transaccion: si algo falla, deshace TODO
        await connection.beginTransaction();

        // 1. Inserta la cancion en tabla musica
        const [result] = await connection.query(`
            INSERT INTO musica 
            (titulo, letra, link_audio, duracion_segundos, grupo_id)
            VALUES (?, ?, ?, ?, ?)
        `, [titulo, letra, link_audio, duracion_segundos, grupo_id]);

        // Obtiene el ID que autogener la BD
        const musicaId = result.insertId;

        // 2. Inserta los generos en tabla musica_generos_m (tabla relacion)
        if (generos_ids.length > 0) {
            const valores = generos_ids.map((generoId) => [musicaId, generoId]);

            await connection.query(`
                INSERT INTO musica_generos_m (musica_id, genero_id)
                VALUES ?
            `, [valores]);
        }

        // 3. Confirma los cambios en BD
        await connection.commit();

        // 4. Retorna la cancion completa con generos y grupo
        return obtenerMusicaPorId(musicaId);
    } catch (error) {
        // Si falla, deshace TODO lo pendiente
        await connection.rollback();
        throw error;
    } finally {
        // Libera la conexion siempre
        connection.release();
    }
}

// Editar cancion con transaccion: UPDATE musica + DELETE + INSERT generos
async function editarMusica(id, data) {
    // Extrae los datos del JSON enviado
    const {
        titulo,
        letra,
        link_audio,
        duracion_segundos,
        grupo_id,
        generos_ids = [],
    } = data;

    // Obtiene una conexion exclusiva con la BD
    const connection = await db.getConnection();

    try {
        // Inicia transaccion: si algo falla, deshace TODO
        await connection.beginTransaction();

        // 1. Actualiza los campos principales de la tabla musica
        const [result] = await connection.query(`
            UPDATE musica
            SET
                titulo = ?,
                letra = ?,
                link_audio = ?,
                duracion_segundos = ?,
                grupo_id = ?
            WHERE id = ?
        `, [titulo, letra, link_audio, duracion_segundos, grupo_id, id]);

        // Si no se actualizo nada, la cancion no existe
        if (result.affectedRows === 0) {
            await connection.rollback(); // Cancela la transaccion
            return null;
        }

        // 2. Borra TODOS los generos antiguos de esta cancion
        await connection.query(`
            DELETE FROM musica_generos_m
            WHERE musica_id = ?
        `, [id]);

        // 3. Inserta los generos NUEVOS (si hay)
        if (generos_ids.length > 0) {
            // Crea pares [musica_id, genero_id] para cada genero
            const valores = generos_ids.map((generoId) => [id, generoId]);
            await connection.query(`
                INSERT INTO musica_generos_m (musica_id, genero_id)
                VALUES ?
            `, [valores]);
        }

        // 4. Confirma los cambios en BD (AHORA se guardan)
        await connection.commit();

        // 5. Retorna la cancion actualizada (SELECT completo con generos y grupo)
        return obtenerMusicaPorId(id);
    } catch (error) {
        // Si algo falla, deshace TODO lo pendiente
        await connection.rollback();
        throw error;
    } finally {
        // Libera la conexion siempre
        connection.release();
    }
}

// Eliminar cancion con transaccion: borra relaciones + cancion
async function eliminarMusica(id) {
    const connection = await db.getConnection();

    try {
        // Inicia transaccion: si algo falla, deshace TODO
        await connection.beginTransaction();

        // 1. Borra los generos asociados a esta cancion
        await connection.query(`
            DELETE FROM musica_generos_m
            WHERE musica_id = ?
        `, [id]);

        // 2. Borra la cancion de las playlists donde este
        await connection.query(`
            DELETE FROM lista_musica_m
            WHERE musica_id = ?
        `, [id]);

        // 3. Borra la cancion de la tabla musica
        const [result] = await connection.query(`
            DELETE FROM musica
            WHERE id = ?
        `, [id]);

        // 4. Confirma los cambios en BD
        await connection.commit();

        // Retorna true si se elimino, false si no existia
        return result.affectedRows > 0;
    } catch (error) {
        // Si falla, deshace TODO lo pendiente
        await connection.rollback();
        throw error;
    } finally {
        // Libera la conexion siempre
        connection.release();
    }
}

module.exports = {
    listarMusica,
    obtenerMusicaPorId,
    crearMusica,
    editarMusica,
    eliminarMusica,
};

/*
|--------------------------------------------------------------------------
| NOTA IMPORTANTE: TRANSACCIONES
|--------------------------------------------------------------------------
| Las funciones crearMusica, editarMusica y eliminarMusica usan transacciones
| para garantizar consistencia en la BD:
|
| - beginTransaction(): Inicia transaccion, cambios no se guardan aun
| - commit(): Confirma y guarda TODOS los cambios en BD
| - rollback(): Si hay error, deshace TODOS los cambios pendientes
|
| Ejemplo con editarMusica:
|   Si UPDATE musica funciona pero INSERT generos falla,
|   la transaccion deshace el UPDATE (rollback) para no quedar a mitad
|
| Sin transacciones:
|   UPDATE se guardaria, pero los generos estarian inconsistentes
|   La cancion quedaria con datos viejos de generos
|--------------------------------------------------------------------------
*/