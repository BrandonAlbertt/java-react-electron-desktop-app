const AvatarModel = require("../models/avatar.model");

/*
    Lista todos los avatares
*/
async function listarAvatares(req, res) {
    try {
        const avatares = await AvatarModel.listarAvatares();

        res.json(avatares);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al listar avatares",
            error
        });
    }
}

/*
    Obtiene un avatar por ID
*/
async function obtenerAvatarPorId(req, res) {
    try {
        const { id } = req.params;

        const avatar = await AvatarModel.obtenerAvatarPorId(id);

        if (!avatar) {
            return res.status(404).json({
                mensaje: "Avatar no encontrado"
            });
        }

        res.json(avatar);

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener avatar",
            error
        });
    }
}

/*
    Crea un nuevo avatar
*/
async function crearAvatar(req, res) {
    try {
        const { imagen_url, nombre } = req.body;

        if (!imagen_url || !nombre) {
            return res.status(400).json({
                mensaje: "Todos los campos son obligatorios"
            });
        }

        const nuevoAvatar = await AvatarModel.crearAvatar(
            imagen_url,
            nombre
        );

        res.status(201).json(nuevoAvatar);

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al crear avatar",
            error
        });
    }
}

/*
    Actualiza un avatar
*/
async function actualizarAvatar(req, res) {
    try {
        const { id } = req.params;
        const { imagen_url, nombre } = req.body;

        const avatarExiste = await AvatarModel.obtenerAvatarPorId(id);

        if (!avatarExiste) {
            return res.status(404).json({
                mensaje: "Avatar no encontrado"
            });
        }

        const avatarActualizado = await AvatarModel.actualizarAvatar(
            id,
            imagen_url,
            nombre
        );

        res.json(avatarActualizado);

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar avatar",
            error
        });
    }
}

/*
    Elimina un avatar
*/
async function eliminarAvatar(req, res) {
    try {
        const { id } = req.params;

        const avatarExiste = await AvatarModel.obtenerAvatarPorId(id);

        if (!avatarExiste) {
            return res.status(404).json({
                mensaje: "Avatar no encontrado"
            });
        }

        await AvatarModel.eliminarAvatar(id);

        res.json({
            mensaje: "Avatar eliminado correctamente"
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar avatar",
            error
        });
    }
}

module.exports = {
    listarAvatares,
    obtenerAvatarPorId,
    crearAvatar,
    actualizarAvatar,
    eliminarAvatar,
};