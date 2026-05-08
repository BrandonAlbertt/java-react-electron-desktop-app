// Importa el model de playlists.
// El controller maneja HTTP (req/res) y el model maneja SQL.
const playlistModel = require("../models/playlist.model");

// Crea una lista nueva para un usuario.
// Llega desde: POST /api/usuarios/:usuarioId/listas (definido en routes/playlist.routes.js)
async function crearLista(req, res) {
    try {
        // usuarioId viene en la URL; nombre y url_imagen vienen en el body JSON
        const { usuarioId } = req.params;
        const { nombre, url_imagen } = req.body;

        // Validación mínima
        if (!nombre) {
            return res.status(400).json({
                mensaje: "El nombre de la lista es obligatorio",
            });
        }

        // Llama al model para insertar en base de datos
        const nuevaListaId = await playlistModel.crearLista(usuarioId, nombre, url_imagen || null);

        // Respuesta exitosa
        res.status(201).json({
            mensaje: "Lista creada correctamente",
            lista: {
                id: nuevaListaId,
                nombre,
                // -> Se devuelve la imagen nueva de la lista
                url_imagen: url_imagen || null,
                usuario_id: Number(usuarioId),
            },
        });
    } catch (error) {
        // Error inesperado
        console.error("Error al crear lista:", error);

        res.status(500).json({
            mensaje: "Error al crear lista",
        });
    }
}

// Lista todas las playlists de un usuario.
// Llega desde: GET /api/usuarios/:usuarioId/listas
async function listarListasPorUsuario(req, res) {
    try {
        const { usuarioId } = req.params;

        // Consulta al model
        const listas = await playlistModel.listarListasPorUsuario(usuarioId);

        // Devuelve lista en JSON con url_imagen incluida desde el model
        res.json(listas);
    } catch (error) {
        console.error("Error al listar listas:", error);

        res.status(500).json({
            mensaje: "Error al listar listas",
        });
    }
}

// Agrega una canción a una playlist.
// Llega desde: POST /api/listas/:listaId/canciones/:musicaId
async function agregarCancionALista(req, res) {
    try {
        const { listaId, musicaId } = req.params;

        // Inserta relación lista-canción en la tabla puente
        await playlistModel.agregarCancionALista(listaId, musicaId);

        res.status(201).json({
            mensaje: "Canción agregada a la lista correctamente",
            datos: {
                lista_id: Number(listaId),
                musica_id: Number(musicaId),
            },
        });
    } catch (error) {
        console.error("Error al agregar canción:", error);

        // Si ya existe esa canción en la lista, evita duplicados
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                mensaje: "La canción ya existe en esta lista",
            });
        }

        res.status(500).json({
            mensaje: "Error al agregar canción a la lista",
        });
    }
}

// Quita una canción de una playlist.
// Llega desde: DELETE /api/listas/:listaId/canciones/:musicaId
async function quitarCancionDeLista(req, res) {
    try {
        const { listaId, musicaId } = req.params;

        // El model devuelve cuántas filas se borraron
        const filasAfectadas = await playlistModel.quitarCancionDeLista(listaId, musicaId);

        // Si no borró nada, esa canción no estaba en la lista
        if (filasAfectadas === 0) {
            return res.status(404).json({
                mensaje: "La canción no estaba en esta lista",
            });
        }

        res.json({
            mensaje: "Canción quitada de la lista correctamente",
        });
    } catch (error) {
        console.error("Error al quitar canción:", error);

        res.status(500).json({
            mensaje: "Error al quitar canción de la lista",
        });
    }
}

// Elimina una playlist completa.
// Llega desde: DELETE /api/listas/:listaId
async function eliminarLista(req, res) {
    try {
        const { listaId } = req.params;

        // Borra canciones asociadas y luego la lista
        const filasAfectadas = await playlistModel.eliminarLista(listaId);

        // Si no encontró la lista
        if (filasAfectadas === 0) {
            return res.status(404).json({
                mensaje: "Lista no encontrada",
            });
        }

        res.json({
            mensaje: "Lista eliminada correctamente",
        });
    } catch (error) {
        console.error("Error al eliminar lista:", error);

        res.status(500).json({
            mensaje: "Error al eliminar lista",
        });
    }
}

// Renombra una playlist existente.
// Llega desde: PUT /api/listas/:listaId
async function renombrarLista(req, res) { 
    try {
        const { listaId } = req.params;
        const { nuevoNombre } = req.body;

        if (!nuevoNombre) {
            return res.status(400).json({
                mensaje: "El nuevo nombre es obligatorio",
            });
        }

        // verifica que la lista exista
        const listaActual = await playlistModel.obtenerListaPorId(listaId);
        if (!listaActual) {
            return res.status(404).json({
                mensaje: "Lista no encontrada",
            });
        }

        // actualiza el nombre de la lista
        const editado = await playlistModel.renombrarLista(listaId, nuevoNombre);

        if (!editado) {
            return res.status(404).json({
                mensaje: "Lista no encontrada",
            });
        }

        return res.json({
            mensaje: "Lista renombrada correctamente",
            lista: {
                ...listaActual,
                nombre: nuevoNombre,
            },
        });

    } catch (error) {
        console.error("Error al renombrar lista:", error);
        res.status(500).json({
            mensaje: "Error al renombrar lista",
        });

    }
}




// Exporta funciones para que las use routes/playlist.routes.js
module.exports = {
    crearLista,
    listarListasPorUsuario,
    agregarCancionALista,
    quitarCancionDeLista,
    eliminarLista,
    renombrarLista,
};