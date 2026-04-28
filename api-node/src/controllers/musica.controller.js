// CONTROLLER DE MUSICA
// Relacion: routes -> controller -> model -> BD
// El controller recibe la request (req), extrae datos, llama al model y devuelve response (res)

const musicaModel = require("../models/musica.model");

// GET /api/musica - Listar todas las canciones
async function listarMusica(req, res) {
    try {
        // Llama al model para obtener todas las canciones
        const musica = await musicaModel.listarMusica();
        // Responde con array JSON
        res.json(musica);
    } catch (error) {
        console.error("Error al listar música:", error);
        res.status(500).json({ mensaje: "Error al listar música" });
    }
}

// GET /api/musica/:id - Obtener cancion por ID
async function obtenerMusicaPorId(req, res) {
    try {
        // Extrae el ID de la URL (ej: /api/musica/5 -> id=5)
        const { id } = req.params;
        // Llama al model pasando el ID
        const musica = await musicaModel.obtenerMusicaPorId(id);
        // Si no existe, retorna 404
        if (!musica) {
            return res.status(404).json({ mensaje: "Canción no encontrada" });
        }
        // Responde con la cancion
        res.json(musica);
    } catch (error) {
        console.error("Error al obtener música por id:", error);
        res.status(500).json({ mensaje: "Error al obtener música" });
    }
}

// POST /api/musica - Crear cancion
async function crearMusica(req, res) {
    try {
        // req.body contiene el JSON enviado (titulo, letra, link_audio, duracion_segundos, grupo_id, generos_ids)
        const nuevaMusica = await musicaModel.crearMusica(req.body);
        // Responde con status 201 (Created) y los datos guardados
        res.status(201).json({
            mensaje: "Canción creada correctamente",
            musica: nuevaMusica,
        });
    } catch (error) {
        console.error("Error al crear música:", error);
        res.status(500).json({ mensaje: "Error al crear música" });
    }
}

// PUT /api/musica/:id - Editar cancion
async function editarMusica(req, res) {
    try {
        // Extrae el ID de la URL
        const { id } = req.params;
        // Llama al model para actualizar con los datos del body
        const musicaEditada = await musicaModel.editarMusica(id, req.body);
        // Si no existe la cancion, retorna 404
        if (!musicaEditada) {
            return res.status(404).json({ mensaje: "Canción no encontrada" });
        }
        // Responde con la cancion actualizada
        res.json({
            mensaje: "Canción editada correctamente",
            musica: musicaEditada,
        });
    } catch (error) {
        console.error("Error al editar música:", error);
        res.status(500).json({ mensaje: "Error al editar música" });
    }
}

// DELETE /api/musica/:id - Eliminar cancion
async function eliminarMusica(req, res) {
    try {
        // Extrae el ID de la URL
        const { id } = req.params;
        // Llama al model para eliminar
        const eliminado = await musicaModel.eliminarMusica(id);
        // Si no existia, retorna 404
        if (!eliminado) {
            return res.status(404).json({ mensaje: "Canción no encontrada" });
        }
        // Responde con mensaje de exito
        res.json({
            mensaje: "Canción eliminada correctamente",
        });
    } catch (error) {
        console.error("Error al eliminar música:", error);
        res.status(500).json({ mensaje: "Error al eliminar música" });
    }
}

module.exports = {
    listarMusica,
    obtenerMusicaPorId,
    crearMusica,
    editarMusica,
    eliminarMusica,
};