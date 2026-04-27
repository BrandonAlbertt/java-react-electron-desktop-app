// Importa el model de música.
// El controller maneja HTTP (req/res) y el model maneja SQL.
const musicaModel = require("../models/musica.model");

// Controlador para listar canciones.
// Llega desde: GET /api/musica (definido en routes/musica.routes.js)
async function listarMusica(req, res) {
    try {
        // Pide al model la data de base de datos
        const musica = await musicaModel.listarMusica();

        // Responde en JSON
        res.json(musica);
    } catch (error) {
        console.error("Error al listar música:", error);

        res.status(500).json({
            mensaje: "Error al listar música",
        });
    }
}

// Controlador para obtener una canción por id.
// Llega desde: GET /api/musica/:id
async function obtenerMusicaPorId(req, res) {
    try {
        // id viene por parámetro en la URL
        const { id } = req.params;

        // Consulta al model
        const musica = await musicaModel.obtenerMusicaPorId(id);

        // Si no existe, responde 404
        if (!musica) {
            return res.status(404).json({
                mensaje: "Canción no encontrada",
            });
        }

        // Si existe, devuelve la canción
        res.json(musica);
    } catch (error) {
        console.error("Error al obtener música por id:", error);

        res.status(500).json({
            mensaje: "Error al obtener música",
        });
    }
}

// Exporta funciones para que las use routes/musica.routes.js
module.exports = {
    listarMusica,
    obtenerMusicaPorId,
};