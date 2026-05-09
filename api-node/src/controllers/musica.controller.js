// =============================
// IMPORTS
// =============================
// fs y path se usan para borrar
// archivos fisicos del servidor.
const fs = require("fs");
const path = require("path");

const musicaModel = require("../models/musica.model");

// =============================
// VARIABLES DE ENTORNO
// =============================
// PUBLIC_URL sirve para crear la url publica.
// MEDIA_ROOT sirve para ubicar archivos
// dentro del contenedor docker.
const PUBLIC_URL = process.env.PUBLIC_URL || "http://localhost:3000";
const MEDIA_ROOT = process.env.MEDIA_ROOT || "/media";

// =============================
// LISTAR MUSICA
// =============================
// devuelve todas las canciones.
async function listarMusica(req, res) {
    try {
        const musica = await musicaModel.listarMusica();

        res.json(musica);
    } catch (error) {
        console.error("Error al listar música:", error);

        res.status(500).json({
            mensaje: "Error al listar música",
            error: error.message,
        });
    }
}

// =============================
// OBTENER MUSICA POR ID
// =============================
// busca una cancion por id.
async function obtenerMusicaPorId(req, res) {
    try {
        const { id } = req.params;

        const musica = await musicaModel.obtenerMusicaPorId(id);

        if (!musica) {
            return res.status(404).json({
                mensaje: "Canción no encontrada",
            });
        }

        res.json(musica);
    } catch (error) {
        console.error("Error al obtener música por id:", error);

        res.status(500).json({
            mensaje: "Error al obtener música",
            error: error.message,
        });
    }
}

// =============================
// CREAR MUSICA NORMAL
// =============================
// crea cancion usando json manual.
async function crearMusica(req, res) {
    try {
        const nuevaMusica = await musicaModel.crearMusica(req.body);

        res.status(201).json({
            mensaje: "Canción creada correctamente",
            musica: nuevaMusica,
        });
    } catch (error) {
        console.error("Error al crear música:", error);

        res.status(500).json({
            mensaje: "Error al crear música",
            error: error.message,
        });
    }
}

// =============================
// CREAR MUSICA CON AUDIO
// =============================
// sube mp3/wav/m4a al servidor,
// genera link_audio y guarda en bd.
async function crearMusicaConAudio(req, res) {
    try {
        const {
            titulo,
            letra,
            duracion_segundos,
            grupo_id,
            generos_ids,
        } = req.body;

        if (!titulo || !grupo_id || !req.file) {
            return res.status(400).json({
                mensaje: "titulo, grupo_id y audio son obligatorios",
            });
        }

        // req.grupo viene desde uploadMusica.middleware.js
        const grupo = req.grupo;

        const link_audio = `${PUBLIC_URL}/media/musicbh/${grupo.carpeta_slug}/canciones/${req.file.filename}`;

        const nuevaMusica = await musicaModel.crearMusica({
            titulo,
            letra: letra || "",
            link_audio,
            duracion_segundos: duracion_segundos || null,
            grupo_id,
            generos_ids: generos_ids ? JSON.parse(generos_ids) : [],
        });

        res.status(201).json({
            mensaje: "Canción subida correctamente",
            musica: nuevaMusica,
        });
    } catch (error) {
        console.error("Error al subir música:", error);

        res.status(500).json({
            mensaje: "Error al subir música",
            error: error.message,
        });
    }
}

// =============================
// EDITAR MUSICA
// =============================
// actualiza datos de una cancion.
async function editarMusica(req, res) {
    try {
        const { id } = req.params;

        const musicaEditada = await musicaModel.editarMusica(
            id,
            req.body
        );

        if (!musicaEditada) {
            return res.status(404).json({
                mensaje: "Canción no encontrada",
            });
        }

        res.json({
            mensaje: "Canción editada correctamente",
            musica: musicaEditada,
        });
    } catch (error) {
        console.error("Error al editar música:", error);

        res.status(500).json({
            mensaje: "Error al editar música",
            error: error.message,
        });
    }
}

// =============================
// ELIMINAR MUSICA
// =============================
// elimina cancion de:
// - playlists
// - generos
// - tabla musica
// - archivo fisico
async function eliminarMusica(req, res) {
    try {
        const { id } = req.params;

        // primero buscamos la cancion
        // para conocer su link_audio
        const musica = await musicaModel.obtenerMusicaPorId(id);

        if (!musica) {
            return res.status(404).json({
                mensaje: "Canción no encontrada",
            });
        }

        // elimina relaciones y registro en bd
        const eliminado = await musicaModel.eliminarMusica(id);

        if (!eliminado) {
            return res.status(404).json({
                mensaje: "Canción no encontrada",
            });
        }

        // borrar archivo fisico si existe link_audio
        if (musica.link_audio) {
            const url = new URL(musica.link_audio);

            const rutaRelativa = decodeURIComponent(
                url.pathname.replace("/media/", "")
            );

            const archivoPath = path.join(
                MEDIA_ROOT,
                rutaRelativa
            );

            fs.rmSync(archivoPath, {
                force: true,
            });

            console.log("🗑️ Audio eliminado:", archivoPath);
        }

        res.json({
            mensaje: "Canción eliminada correctamente",
            musica_eliminada: musica,
        });
    } catch (error) {
        console.error("Error al eliminar música:", error);

        res.status(500).json({
            mensaje: "Error al eliminar música",
            error: error.message,
        });
    }
}

// =============================
// EXPORTAR CONTROLADORES
// =============================
// estas funciones se usan
// en musica.routes.js
module.exports = {
    listarMusica,
    obtenerMusicaPorId,
    crearMusica,
    crearMusicaConAudio,
    editarMusica,
    eliminarMusica,
};