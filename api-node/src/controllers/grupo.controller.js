const GrupoModel = require("../models/grupo.model");
const PUBLIC_URL = process.env.PUBLIC_URL || "http://localhost:3000";


// Controller: aquí va la lógica que recibe las peticiones HTTP.
// Relación simple para principiantes:
// 1) El navegador o Postman llama a una URL (ej. /api/grupos-musicales)
// 2) Esa URL está definida en `grupo.routes.js` y apunta a una función
//    de este archivo (controller).
// 3) El controller usa `GrupoModel` para leer/escribir en la base de datos.
// 4) El model usa `db` para ejecutar SQL.

// Lista todos los grupos. (GET /api/grupos-musicales)
async function listarGrupos(req, res) {
    try {
        const grupos = await GrupoModel.listarGrupos();
        res.json(grupos);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al listar grupos musicales",
            error,
        });
    }
}

// Obtiene un grupo por id. (GET /api/grupos-musicales/:id)
// - `:id` viene en `req.params` y es parte de la URL.
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
            error,
        });
    }
}

// Crea un grupo. (POST /api/grupos-musicales)
// - En Postman: seleccionar POST, URL `http://localhost:3000/api/grupos-musicales`
// - En la pestaña Body seleccionar `raw` y `JSON` y pegar:
//   {
//     "imagen_url": "https://example.com/imagen.jpg",
//     "nombre": "Nombre del grupo"
//   }
// - Asegurarse de enviar el header `Content-Type: application/json`.
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
            error,
        });
    }
}

// Actualiza un grupo. (PUT /api/grupos-musicales/:id)
// - En Postman: usar PUT y cuerpo JSON igual que en crear.
async function actualizarGrupo(req, res) {
    try {
        const { id } = req.params;
        const { imagen_url, nombre } = req.body;

        const grupoExiste = await GrupoModel.obtenerGrupoPorId(id);

        if (!grupoExiste) {
            return res.status(404).json({
                mensaje: "Grupo musical no encontrado",
            });
        }

        const grupoActualizado = await GrupoModel.actualizarGrupo(
            id,
            imagen_url,
            nombre
        );

        res.json(grupoActualizado);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar grupo musical",
            error,
        });
    }
}

// Elimina un grupo. (DELETE /api/grupos-musicales/:id)
async function eliminarGrupo(req, res) {
    try {
        const { id } = req.params;

        const grupoExiste = await GrupoModel.obtenerGrupoPorId(id);

        if (!grupoExiste) {
            return res.status(404).json({
                mensaje: "Grupo musical no encontrado",
            });
        }

        await GrupoModel.eliminarGrupo(id);

        res.json({
            mensaje: "Grupo musical eliminado correctamente",
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar grupo musical",
            error,
        });
    }
}



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

module.exports = {
    listarGrupos,
    obtenerGrupoPorId,
    crearGrupo,
    actualizarGrupo,
    eliminarGrupo,
    crearGrupoConImagen,
};