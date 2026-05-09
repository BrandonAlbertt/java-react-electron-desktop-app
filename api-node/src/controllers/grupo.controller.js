const fs = require("fs");
const path = require("path");

const GrupoModel = require("../models/grupo.model");

const PUBLIC_URL = process.env.PUBLIC_URL || "http://localhost:3000";
const MEDIA_ROOT = process.env.MEDIA_ROOT || "/media";

// =============================
// LISTAR GRUPOS
// =============================
// devuelve todos los grupos musicales
async function listarGrupos(req, res) {
    try {
        const grupos = await GrupoModel.listarGrupos();
        res.json(grupos);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al listar grupos musicales",
            error: error.message,
        });
    }
}

// =============================
// OBTENER GRUPO POR ID
// =============================
// busca un grupo usando el id de la url
async function obtenerGrupoPorId(req, res) {
    try {
        const { id } = req.params;

        const grupo = await GrupoModel.obtenerGrupoPorId(id);

        if (!grupo) {
            return res.status(404).json({
                mensaje: "Grupo musical no encontrado",
            });
        }

        res.json(grupo);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener grupo musical",
            error: error.message,
        });
    }
}

// =============================
// CREAR GRUPO NORMAL
// =============================
// crea grupo usando datos json manuales
async function crearGrupo(req, res) {
    try {
        const { imagen_url, nombre, carpeta_slug } = req.body;

        if (!imagen_url || !nombre) {
            return res.status(400).json({
                mensaje: "imagen_url y nombre son obligatorios",
            });
        }

        const nuevoGrupo = await GrupoModel.crearGrupo(
            imagen_url,
            nombre,
            carpeta_slug || null
        );

        res.status(201).json(nuevoGrupo);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al crear grupo musical",
            error: error.message,
        });
    }
}

// =============================
// CREAR GRUPO CON IMAGEN
// =============================
// crea carpeta, sube imagen y guarda url en bd
async function crearGrupoConImagen(req, res) {
    try {
        const nombre = req.body.nombre;
        const carpetaSlug = req.carpetaSlug;

        if (!nombre || !req.file) {
            return res.status(400).json({
                mensaje: "El nombre y la imagen son obligatorios",
            });
        }

        const imagenUrl = `${PUBLIC_URL}/media/musicbh/${carpetaSlug}/${req.file.filename}`;

        const nuevoGrupo = await GrupoModel.crearGrupo(
            imagenUrl,
            nombre,
            carpetaSlug
        );

        res.status(201).json({
            mensaje: "Grupo creado correctamente",
            grupo: nuevoGrupo,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al crear grupo con imagen",
            error: error.message,
        });
    }
}

// =============================
// ACTUALIZAR GRUPO
// =============================
// actualiza datos del grupo
async function actualizarGrupo(req, res) {
    try {
        const { id } = req.params;
        const { imagen_url, nombre, carpeta_slug } = req.body;

        const grupoExiste = await GrupoModel.obtenerGrupoPorId(id);

        if (!grupoExiste) {
            return res.status(404).json({
                mensaje: "Grupo musical no encontrado",
            });
        }

        const grupoActualizado = await GrupoModel.actualizarGrupo(
            id,
            imagen_url || grupoExiste.imagen_url,
            nombre || grupoExiste.nombre,
            carpeta_slug || grupoExiste.carpeta_slug
        );

        res.json(grupoActualizado);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar grupo musical",
            error: error.message,
        });
    }
}

// =============================
// ELIMINAR GRUPO COMPLETO
// =============================
// elimina grupo, canciones, relaciones y carpeta fisica
async function eliminarGrupo(req, res) {
    try {
        const { id } = req.params;

        // buscar grupo antes de borrar
        const grupoExiste = await GrupoModel.obtenerGrupoPorId(id);

        if (!grupoExiste) {
            return res.status(404).json({
                mensaje: "Grupo musical no encontrado",
            });
        }

        // eliminar relaciones, canciones y grupo en una sola transaccion
        const resultadoEliminacion = await GrupoModel.eliminarGrupoCompleto(id);

        // eliminar carpeta fisica del grupo
        if (grupoExiste.carpeta_slug) {
            const carpetaGrupo = path.join(
                MEDIA_ROOT,
                "musicbh",
                grupoExiste.carpeta_slug
            );

            fs.rmSync(carpetaGrupo, {
                recursive: true,
                force: true,
            });

            console.log("🗑️ Carpeta eliminada:", carpetaGrupo);
        }

        res.json({
            mensaje: "Grupo eliminado correctamente",
            grupo_eliminado: grupoExiste,
            musicas_eliminadas: resultadoEliminacion.musicas_eliminadas,
            relaciones_eliminadas: resultadoEliminacion.relaciones_eliminadas,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al eliminar grupo musical",
            error: error.message,
        });
    }
}

// =============================
// EXPORTAR CONTROLADORES
// =============================
// estas funciones se usan en grupo.routes.js
module.exports = {
    listarGrupos,
    obtenerGrupoPorId,
    crearGrupo,
    crearGrupoConImagen,
    actualizarGrupo,
    eliminarGrupo,
};
