// Conexión al pool de MySQL (src/config/db.js)
const db = require("../config/db");

// Inserta una lista nueva para un usuario.
// Ahora también guarda url_imagen, que fue agregada a lista_musicales con ALTER TABLE.
// La usa: playlist.controller -> crearLista()
async function crearLista(usuarioId, nombre, urlImagen = null) {
    const [result] = await db.query(`
        INSERT INTO lista_musicales (nombre, url_imagen, usuario_id)
        VALUES (?, ?, ?)
    `, [nombre, urlImagen, usuarioId]);

    return result.insertId;
}

// Devuelve las listas de un usuario con cantidad de canciones.
// Se incluye url_imagen para que la vista pueda mostrar la portada de cada lista.
// La usa: playlist.controller -> listarListasPorUsuario()
async function listarListasPorUsuario(usuarioId) {
    const [rows] = await db.query(`
        SELECT
            l.id,
            l.nombre,
            l.url_imagen,
            COUNT(lm.musica_id) AS cantidad_canciones
        FROM lista_musicales l
        LEFT JOIN lista_musica_m lm
            ON l.id = lm.lista_id
        WHERE l.usuario_id = ?
        GROUP BY l.id, l.nombre, l.url_imagen
        ORDER BY l.id DESC
    `, [usuarioId]);

    return rows;
}

// Agrega relación lista-canción en tabla puente lista_musica_m.
// La usa: playlist.controller -> agregarCancionALista()
async function agregarCancionALista(listaId, musicaId) {
    const [result] = await db.query(`
        INSERT INTO lista_musica_m (lista_id, musica_id)
        VALUES (?, ?)
    `, [listaId, musicaId]);

    return result;
}

// Elimina una canción específica de una lista.
// La usa: playlist.controller -> quitarCancionDeLista()
// Retorna affectedRows para saber si realmente se borró algo.
async function quitarCancionDeLista(listaId, musicaId) {
    const [result] = await db.query(`
        DELETE FROM lista_musica_m
        WHERE lista_id = ? AND musica_id = ?
    `, [listaId, musicaId]);

    return result.affectedRows;
}

// Elimina una lista completa.
// Paso 1: borra relaciones en lista_musica_m
// Paso 2: borra la lista en lista_musicales
// La usa: playlist.controller -> eliminarLista()
async function eliminarLista(listaId) {
    await db.query(`
        DELETE FROM lista_musica_m
        WHERE lista_id = ?
    `, [listaId]);

    const [result] = await db.query(`
        DELETE FROM lista_musicales
        WHERE id = ?
    `, [listaId]);

    return result.affectedRows;
}

async function obtenerListaPorId(listaId) {
    const [rows] = await db.query(
        `
        SELECT
            id,
            nombre,
            url_imagen,
            usuario_id
        FROM lista_musicales
        WHERE id = ?
        LIMIT 1
    `,
        [listaId]
    );

    return rows[0] || null;
}

async function renombrarLista(listaId, nuevoNombre) {
    const [result] = await db.query(`
        UPDATE lista_musicales
        SET nombre = ?
        WHERE id = ?
    `, [nuevoNombre, listaId]);
    
    return result.affectedRows > 0;
}

// Exporta funciones para usarlas en el controller
module.exports = {
    crearLista,
    listarListasPorUsuario,
    agregarCancionALista,
    quitarCancionDeLista,
    eliminarLista,
    obtenerListaPorId,
    renombrarLista,
};