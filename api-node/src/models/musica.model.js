// Conexión al pool de MySQL (src/config/db.js)
const db = require("../config/db");

// Trae todas las canciones con su grupo y géneros.
// La usa: musica.controller -> listarMusica()
async function listarMusica() {
    // Consulta con joins para unir canción, grupo y géneros
    const [rows] = await db.query(`
        SELECT
            m.id,
            m.titulo,
            m.letra,
            m.link_audio,
            m.duracion_segundos,
            g.nombre AS grupo,
            g.imagen_url AS imagen_grupo,
            GROUP_CONCAT(gen.nombre ORDER BY gen.nombre SEPARATOR ',') AS generos
        FROM musica m
        INNER JOIN grupos_musicales g
            ON m.grupo_id = g.id
        LEFT JOIN musica_generos_m mg
            ON m.id = mg.musica_id
        LEFT JOIN generos_musicales gen
            ON mg.genero_id = gen.id
        GROUP BY
            m.id, m.titulo, m.letra, m.link_audio,
            m.duracion_segundos, g.nombre, g.imagen_url
        ORDER BY m.titulo ASC
    `);

    // Convierte generos de texto "Rock,Pop" a arreglo ["Rock", "Pop"]
    return rows.map((item) => ({
        ...item,
        generos: item.generos ? item.generos.split(",") : [],
    }));
}

// Trae una sola canción por id.
// La usa: musica.controller -> obtenerMusicaPorId()
async function obtenerMusicaPorId(id) {
    // Misma idea de joins, pero filtrando por m.id
    const [rows] = await db.query(`
        SELECT
            m.id,
            m.titulo,
            m.letra,
            m.link_audio,
            m.duracion_segundos,
            g.nombre AS grupo,
            g.imagen_url AS imagen_grupo,
            GROUP_CONCAT(gen.nombre ORDER BY gen.nombre SEPARATOR ',') AS generos
        FROM musica m
        INNER JOIN grupos_musicales g
            ON m.grupo_id = g.id
        LEFT JOIN musica_generos_m mg
            ON m.id = mg.musica_id
        LEFT JOIN generos_musicales gen
            ON mg.genero_id = gen.id
        WHERE m.id = ?
        GROUP BY
            m.id, m.titulo, m.letra, m.link_audio,
            m.duracion_segundos, g.nombre, g.imagen_url
    `, [id]);

    // Toma la primera fila (si existe)
    const musica = rows[0];

    // Si no existe canción con ese id
    if (!musica) return null;

    // Normaliza generos a arreglo
    return {
        ...musica,
        generos: musica.generos ? musica.generos.split(",") : [],
    };
}

// Exporta funciones para usarlas en el controller
module.exports = {
    listarMusica,
    obtenerMusicaPorId,
};