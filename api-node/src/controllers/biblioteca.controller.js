const bibliotecaModel = require("../models/biblioteca.model");

async function obtenerBiblioteca(req, res) {
    try {
        const usuarioId = req.params.id;

        const usuario = await bibliotecaModel.obtenerUsuarioPorId(usuarioId);

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado",
            });
        }

        const rows = await bibliotecaModel.obtenerBibliotecaPorUsuario(usuarioId);

        const listasMap = new Map();

        rows.forEach((row) => {
            if (!listasMap.has(row.lista_id)) {
                listasMap.set(row.lista_id, {
                    id: row.lista_id,
                    nombre: row.lista_nombre,
                    // -> Imagen agregada por la modificación de la tabla
                    imagen: row.lista_imagen,
                    canciones: [],
                });
            }

            if (row.musica_id) {
                listasMap.get(row.lista_id).canciones.push({
                    id: row.musica_id,
                    titulo: row.titulo,
                    grupo: row.grupo,
                    imagen_grupo: row.imagen_grupo,
                    link_audio: row.link_audio,
                    duracion_segundos: row.duracion_segundos,
                    generos: row.generos ? row.generos.split(",") : [],
                });
            }
        });

        res.json({
            usuario,
            listas: Array.from(listasMap.values()),
        });
    } catch (error) {
        console.error("Error al obtener biblioteca:", error);

        res.status(500).json({
            mensaje: "Error al obtener biblioteca",
        });
    }
}

module.exports = {
    obtenerBiblioteca,
};