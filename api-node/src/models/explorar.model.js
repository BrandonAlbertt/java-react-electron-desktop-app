// Conexión a la base de datos (se configura en config/db.js)
const db = require("../config/db");

// Trae todos los géneros musicales ordenados alfabéticamente
async function obtenerGeneros() {
    // Ejecuta una consulta SQL y guarda las filas en rows
    const [rows] = await db.query(`
        SELECT 
            id,
            nombre
        FROM generos_musicales
        ORDER BY nombre ASC
    `);

    // Devuelve la lista de géneros
    return rows;
}

// Trae todos los grupos musicales ordenados por nombre
async function obtenerGrupos() {
    // Consulta los campos principales de cada grupo
    const [rows] = await db.query(`
        SELECT 
            id,
            nombre,
            imagen_url
        FROM grupos_musicales
        ORDER BY nombre ASC
    `);

    // Devuelve la lista de grupos
    return rows;
}

// Trae canciones con su grupo y sus géneros
async function obtenerCanciones() {
    // Une varias tablas para construir la información completa de cada canción
    const [rows] = await db.query(`
        SELECT
            m.id,
            m.titulo,
            m.link_audio,
            m.duracion_segundos,
            gm.nombre AS grupo,
            GROUP_CONCAT(gen.nombre ORDER BY gen.nombre SEPARATOR ',') AS generos
        FROM musica m
        INNER JOIN grupos_musicales gm
            ON m.grupo_id = gm.id
        LEFT JOIN musica_generos_m mg
            ON m.id = mg.musica_id
        LEFT JOIN generos_musicales gen
            ON mg.genero_id = gen.id
        GROUP BY
            m.id,
            m.titulo,
            m.link_audio,
            m.duracion_segundos,
            gm.nombre
        ORDER BY m.titulo ASC
    `);

    // Ajusta el formato para que la API responda limpio y fácil de usar
    return rows.map((cancion) => ({
        id: cancion.id,
        titulo: cancion.titulo,
        grupo: cancion.grupo,
        // Si hay géneros en texto, los separa en un arreglo; si no, devuelve []
        generos: cancion.generos ? cancion.generos.split(",") : [],
        link_audio: cancion.link_audio,
        duracion_segundos: cancion.duracion_segundos,
    }));
}

// Exporta las funciones para usarlas en controladores o rutas
module.exports = {
    obtenerGeneros,
    obtenerGrupos,
    obtenerCanciones,
};