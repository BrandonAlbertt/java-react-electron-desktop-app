const GeneroModel = require("../models/genero.model");

// Controller para géneros musicales.
// Flujo para principiantes:
// - El navegador o Postman llama a una URL definida en routes.
// - Esa ruta ejecuta una función de este archivo (controller).
// - El controller valida datos y usa el model para consultas SQL.

// GET /api/generos-musicales
async function listarGeneros(req, res) {
    try {
        const generos = await GeneroModel.listarGeneros();
        res.json(generos);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al listar géneros musicales",
            error,
        });
    }
}

// GET /api/generos-musicales/:id
async function obtenerGeneroPorId(req, res) {
    try {
        const { id } = req.params;

        const genero = await GeneroModel.obtenerGeneroPorId(id);

        if (!genero) {
            return res.status(404).json({
                mensaje: "Género musical no encontrado",
            });
        }

        res.json(genero);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener género musical",
            error,
        });
    }
}

// POST /api/generos-musicales
// En Postman: seleccionar POST, Body -> raw -> JSON y enviar:
// { "nombre": "Rock" }
async function crearGenero(req, res) {
    try {
        const { nombre } = req.body;

        if (!nombre) {
            return res.status(400).json({
                mensaje: "El nombre es obligatorio",
            });
        }

        const nuevoGenero = await GeneroModel.crearGenero(nombre);

        res.status(201).json(nuevoGenero);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al crear género musical",
            error,
        });
    }
}

// PUT /api/generos-musicales/:id
// En Postman: usar PUT y enviar JSON igual que en crear.
async function actualizarGenero(req, res) {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        const generoExiste = await GeneroModel.obtenerGeneroPorId(id);

        if (!generoExiste) {
            return res.status(404).json({
                mensaje: "Género musical no encontrado",
            });
        }

        const generoActualizado = await GeneroModel.actualizarGenero(id, nombre);

        res.json(generoActualizado);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar género musical",
            error,
        });
    }
}

// DELETE /api/generos-musicales/:id
async function eliminarGenero(req, res) {
    try {
        const { id } = req.params;

        const generoExiste = await GeneroModel.obtenerGeneroPorId(id);

        if (!generoExiste) {
            return res.status(404).json({
                mensaje: "Género musical no encontrado",
            });
        }

        await GeneroModel.eliminarGenero(id);

        res.json({
            mensaje: "Género musical eliminado correctamente",
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar género musical",
            error,
        });
    }
}

module.exports = {
    listarGeneros,
    obtenerGeneroPorId,
    crearGenero,
    actualizarGenero,
    eliminarGenero,
};