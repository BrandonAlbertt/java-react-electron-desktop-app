const fs = require("fs");
const path = require("path");

const musicaModel = require("../models/musica.model");
const { crearSlug } = require("../utils/slug");

// =============================
// VARIABLES DE ENTORNO
// =============================
// MEDIA_ROOT es /media dentro de docker.
const PUBLIC_URL = process.env.PUBLIC_URL || "http://localhost:3000";
const MEDIA_ROOT = process.env.MEDIA_ROOT || "/media";

// =============================
// HELPERS
// =============================
// utilidades pequeñas para datos y archivos.
function parseGenerosIds(valor) {
    if (valor === undefined || valor === null || valor === "") {
        return [];
    }

    let generos = valor;

    if (typeof valor === "string") {
        try {
            generos = JSON.parse(valor);
        } catch (error) {
            throw new Error("generos_ids debe ser un array o un JSON valido, ejemplo: [1,2]");
        }
    }

    if (!Array.isArray(generos)) {
        throw new Error("generos_ids debe ser un array");
    }

    return [...new Set(generos
        .map((id) => Number(id))
        .filter((id) => Number.isInteger(id) && id > 0))];
}

function parseDuracion(valor) {
    if (valor === undefined || valor === null || valor === "") {
        return null;
    }

    const duracion = Number(valor);

    if (!Number.isFinite(duracion) || duracion < 0) {
        throw new Error("duracion_segundos debe ser un numero mayor o igual a 0");
    }

    return duracion;
}

function crearLinkAudio(carpetaSlug, filename) {
    return `${PUBLIC_URL}/media/musicbh/${carpetaSlug}/canciones/${filename}`;
}

function obtenerPathDesdeLink(linkAudio) {
    if (!linkAudio) return null;

    let pathname = linkAudio;

    try {
        pathname = new URL(linkAudio).pathname;
    } catch (error) {
        // permite links guardados como /media/...
    }

    if (!pathname.startsWith("/media/")) {
        return null;
    }

    const rutaRelativa = decodeURIComponent(pathname.replace(/^\/media\/?/, ""));
    const archivoPath = path.normalize(path.join(MEDIA_ROOT, rutaRelativa));
    const mediaRootNormalizado = path.normalize(MEDIA_ROOT);

    if (!archivoPath.startsWith(mediaRootNormalizado)) {
        return null;
    }

    return archivoPath;
}

function crearNombreAudio(titulo, extension) {
    const tituloSlug = crearSlug(titulo);

    if (!tituloSlug) {
        throw new Error("El titulo no genera un nombre de archivo valido");
    }

    return `${tituloSlug}${extension || ".mp3"}`;
}

function guardarAudioSubido(file, titulo, grupo) {
    if (!grupo.carpeta_slug) {
        const error = new Error("El grupo no tiene carpeta_slug configurado");
        error.statusCode = 400;
        throw error;
    }

    const extension = path.extname(file.originalname).toLowerCase() || ".mp3";
    const filename = crearNombreAudio(titulo, extension);
    const cancionesPath = path.join(
        MEDIA_ROOT,
        "musicbh",
        grupo.carpeta_slug,
        "canciones"
    );
    const archivoPath = path.join(cancionesPath, filename);

    fs.mkdirSync(cancionesPath, {
        recursive: true,
    });

    if (fs.existsSync(archivoPath)) {
        const error = new Error("Ya existe un audio con ese titulo en la carpeta del grupo");
        error.statusCode = 409;
        throw error;
    }

    fs.writeFileSync(archivoPath, file.buffer);

    return {
        filename,
        archivoPath,
        link_audio: crearLinkAudio(grupo.carpeta_slug, filename),
    };
}

function moverAudioSiCorresponde(musicaActual, datosNuevos, grupoNuevo) {
    if (!musicaActual.link_audio) {
        return {
            link_audio: musicaActual.link_audio,
            archivo_movido: false,
            motivo: "La cancion no tiene link_audio",
        };
    }

    const origenPath = obtenerPathDesdeLink(musicaActual.link_audio);

    if (!origenPath || !fs.existsSync(origenPath)) {
        return {
            link_audio: musicaActual.link_audio,
            archivo_movido: false,
            motivo: "El archivo fisico no existe",
        };
    }

    const extension = path.extname(origenPath).toLowerCase() || ".mp3";
    const filenameNuevo = crearNombreAudio(datosNuevos.titulo, extension);
    const destinoDir = path.join(
        MEDIA_ROOT,
        "musicbh",
        grupoNuevo.carpeta_slug,
        "canciones"
    );
    const destinoPath = path.join(destinoDir, filenameNuevo);

    if (path.normalize(origenPath) === path.normalize(destinoPath)) {
        return {
            link_audio: crearLinkAudio(grupoNuevo.carpeta_slug, filenameNuevo),
            archivo_movido: false,
            motivo: "El archivo ya estaba en la ruta correcta",
        };
    }

    fs.mkdirSync(destinoDir, {
        recursive: true,
    });

    if (fs.existsSync(destinoPath)) {
        return {
            link_audio: musicaActual.link_audio,
            archivo_movido: false,
            motivo: "Ya existe un archivo con el nuevo nombre",
        };
    }

    fs.renameSync(origenPath, destinoPath);

    return {
        link_audio: crearLinkAudio(grupoNuevo.carpeta_slug, filenameNuevo),
        archivo_movido: true,
        origenPath,
        destinoPath,
    };
}

function manejarError(res, mensaje, error) {
    const status = error.statusCode || 500;

    res.status(status).json({
        mensaje,
        error: error.message,
    });
}

// =============================
// LISTAR MUSICA
// =============================
// devuelve todas las canciones.
async function listarMusica(req, res) {
    try {
        const musica = await musicaModel.listarMusica();
        res.json(musica);
    } catch (error) {
        console.error("Error al listar musica:", error);
        manejarError(res, "Error al listar musica", error);
    }
}

// =============================
// OBTENER MUSICA
// =============================
// busca una cancion por id.
async function obtenerMusicaPorId(req, res) {
    try {
        const musica = await musicaModel.obtenerMusicaPorId(req.params.id);

        if (!musica) {
            return res.status(404).json({
                mensaje: "Cancion no encontrada",
            });
        }

        res.json(musica);
    } catch (error) {
        console.error("Error al obtener musica:", error);
        manejarError(res, "Error al obtener musica", error);
    }
}

// =============================
// CREAR MUSICA
// =============================
// crea cancion usando JSON.
async function crearMusica(req, res) {
    try {
        const generos_ids = parseGenerosIds(req.body.generos_ids);

        if (!req.body.titulo || !req.body.grupo_id) {
            return res.status(400).json({
                mensaje: "titulo y grupo_id son obligatorios",
            });
        }

        const nuevaMusica = await musicaModel.crearMusica({
            titulo: req.body.titulo,
            letra: req.body.letra || "",
            link_audio: req.body.link_audio || null,
            duracion_segundos: parseDuracion(req.body.duracion_segundos),
            grupo_id: req.body.grupo_id,
            generos_ids,
        });

        res.status(201).json({
            mensaje: "Cancion creada correctamente",
            musica: nuevaMusica,
        });
    } catch (error) {
        console.error("Error al crear musica:", error);
        manejarError(res, "Error al crear musica", error);
    }
}

// =============================
// CREAR MUSICA CON AUDIO
// =============================
// sube audio y guarda link_audio.
async function crearMusicaConAudio(req, res) {
    let audioGuardado = null;

    try {
        const { titulo, letra, grupo_id } = req.body;

        if (!titulo || !grupo_id || !req.file) {
            return res.status(400).json({
                mensaje: "titulo, grupo_id y audio son obligatorios",
            });
        }

        const generos_ids = parseGenerosIds(req.body.generos_ids);
        const grupo = await musicaModel.obtenerGrupoPorId(grupo_id);

        if (!grupo) {
            return res.status(404).json({
                mensaje: "Grupo musical no encontrado",
            });
        }

        audioGuardado = guardarAudioSubido(req.file, titulo, grupo);

        const nuevaMusica = await musicaModel.crearMusica({
            titulo,
            letra: letra || "",
            link_audio: audioGuardado.link_audio,
            duracion_segundos: parseDuracion(req.body.duracion_segundos),
            grupo_id,
            generos_ids,
        });

        res.status(201).json({
            mensaje: "Cancion subida correctamente",
            musica: nuevaMusica,
        });
    } catch (error) {
        if (audioGuardado && audioGuardado.archivoPath) {
            fs.rmSync(audioGuardado.archivoPath, {
                force: true,
            });
        }

        console.error("Error al subir musica:", error);
        manejarError(res, "Error al subir musica", error);
    }
}

// =============================
// EDITAR MUSICA
// =============================
// actualiza datos, generos y audio si aplica.
async function editarMusica(req, res) {
    let movimiento = null;

    try {
        const { id } = req.params;
        const musicaActual = await musicaModel.obtenerMusicaPorId(id);

        if (!musicaActual) {
            return res.status(404).json({
                mensaje: "Cancion no encontrada",
            });
        }

        const datosNuevos = {
            titulo: req.body.titulo || musicaActual.titulo,
            letra: req.body.letra !== undefined ? req.body.letra : musicaActual.letra,
            duracion_segundos: req.body.duracion_segundos !== undefined
                ? parseDuracion(req.body.duracion_segundos)
                : musicaActual.duracion_segundos,
            grupo_id: req.body.grupo_id || musicaActual.grupo_id,
            generos_ids: req.body.generos_ids !== undefined
                ? parseGenerosIds(req.body.generos_ids)
                : musicaActual.generos_ids,
            link_audio: musicaActual.link_audio,
        };

        const grupoNuevo = await musicaModel.obtenerGrupoPorId(datosNuevos.grupo_id);

        if (!grupoNuevo) {
            return res.status(404).json({
                mensaje: "Grupo musical no encontrado",
            });
        }

        if (!grupoNuevo.carpeta_slug) {
            return res.status(400).json({
                mensaje: "El grupo no tiene carpeta_slug configurado",
            });
        }

        const cambioTitulo = datosNuevos.titulo !== musicaActual.titulo;
        const cambioGrupo = Number(datosNuevos.grupo_id) !== Number(musicaActual.grupo_id);

        if (cambioTitulo || cambioGrupo) {
            movimiento = moverAudioSiCorresponde(musicaActual, datosNuevos, grupoNuevo);
            datosNuevos.link_audio = movimiento.link_audio;
        }

        const musicaEditada = await musicaModel.editarMusica(id, datosNuevos);

        res.json({
            mensaje: "Cancion editada correctamente",
            musica: musicaEditada,
            archivo_audio: movimiento
                ? {
                    movido: movimiento.archivo_movido,
                    motivo: movimiento.motivo || null,
                }
                : {
                    movido: false,
                    motivo: "No cambio titulo ni grupo_id",
                },
        });
    } catch (error) {
        if (movimiento && movimiento.archivo_movido) {
            try {
                fs.renameSync(movimiento.destinoPath, movimiento.origenPath);
            } catch (rollbackError) {
                console.error("No se pudo revertir el movimiento de audio:", rollbackError);
            }
        }

        console.error("Error al editar musica:", error);
        manejarError(res, "Error al editar musica", error);
    }
}

// =============================
// ELIMINAR MUSICA
// =============================
// elimina relaciones, registro y archivo.
async function eliminarMusica(req, res) {
    try {
        const musica = await musicaModel.obtenerMusicaPorId(req.params.id);

        if (!musica) {
            return res.status(404).json({
                mensaje: "Cancion no encontrada",
            });
        }

        const eliminado = await musicaModel.eliminarMusica(req.params.id);

        if (!eliminado) {
            return res.status(404).json({
                mensaje: "Cancion no encontrada",
            });
        }

        const archivoPath = obtenerPathDesdeLink(musica.link_audio);
        let archivoEliminado = false;

        if (archivoPath) {
            fs.rmSync(archivoPath, {
                force: true,
            });
            archivoEliminado = true;
        }

        res.json({
            mensaje: "Cancion eliminada correctamente",
            musica_eliminada: musica,
            archivo_audio: {
                eliminado: archivoEliminado,
                ruta: archivoPath,
            },
        });
    } catch (error) {
        console.error("Error al eliminar musica:", error);
        manejarError(res, "Error al eliminar musica", error);
    }
}

// =============================
// EXPORTAR CONTROLADORES
// =============================
// funciones usadas en musica.routes.js.
module.exports = {
    listarMusica,
    obtenerMusicaPorId,
    crearMusica,
    crearMusicaConAudio,
    editarMusica,
    eliminarMusica,
};
