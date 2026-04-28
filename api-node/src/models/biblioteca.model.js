const db = require("../config/db");

async function obtenerUsuarioPorId(usuarioId) {
    const [rows] = await db.query(`
        SELECT
            u.id,
            u.nombre_usuario,
            a.imagen_url AS avatar
        FROM usuarios u
        INNER JOIN avatares a
            ON u.avatar_id = a.id
        WHERE u.id = ?
    `, [usuarioId]);

    return rows[0];
}

async function obtenerBibliotecaPorUsuario(usuarioId) {
    const [rows] = await db.query(`
        SELECT
            l.id AS lista_id,
            l.nombre AS lista_nombre,
            l.url_imagen AS lista_imagen,

            m.id AS musica_id,
            m.titulo,
            m.link_audio,
            m.duracion_segundos,

            g.nombre AS grupo,
            g.imagen_url AS imagen_grupo,

            GROUP_CONCAT(gen.nombre ORDER BY gen.nombre SEPARATOR ',') AS generos

        FROM lista_musicales l

        LEFT JOIN lista_musica_m lm
            ON l.id = lm.lista_id

        LEFT JOIN musica m
            ON lm.musica_id = m.id

        LEFT JOIN grupos_musicales g
            ON m.grupo_id = g.id

        LEFT JOIN musica_generos_m mg
            ON m.id = mg.musica_id

        LEFT JOIN generos_musicales gen
            ON mg.genero_id = gen.id

        WHERE l.usuario_id = ?

        GROUP BY
            l.id,
            l.nombre,
            l.url_imagen,
            m.id,
            m.titulo,
            m.link_audio,
            m.duracion_segundos,
            g.nombre,
            g.imagen_url

        ORDER BY l.nombre ASC, m.titulo ASC
    `, [usuarioId]);

    return rows;
}

module.exports = {
    obtenerUsuarioPorId,
    obtenerBibliotecaPorUsuario,
};