// CONTROLLER DE USUARIOS
// Relacion: routes -> controller -> model -> BD
// Aqui se recibe la request, se valida y se responde al cliente

const usuarioModel = require("../models/usuario.model");

// GET /api/usuarios
async function listarUsuarios(req, res) {
    try {
        // Llama al model para traer todos los usuarios
        const usuarios = await usuarioModel.listarUsuarios();
        // Responde con un array JSON
        res.json(usuarios);
    } catch (error) {
        console.error("Error al listar usuarios:", error);
        res.status(500).json({ mensaje: "Error al listar usuarios" });
    }
}

// GET /api/usuarios/:id
async function obtenerUsuarioPorId(req, res) {
    try {
        // Saca el ID desde la URL
        const { id } = req.params;

        // Busca el usuario en el model
        const usuario = await usuarioModel.obtenerUsuarioPorId(id);

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado",
            });
        }

        res.json(usuario);
    } catch (error) {
        console.error("Error al obtener usuario:", error);
        res.status(500).json({ mensaje: "Error al obtener usuario" });
    }
}

// POST /api/usuarios
async function crearUsuario(req, res) {
    try {
        // Los datos llegan en req.body desde Postman o frontend
        const {
            avatar_id,
            nombre_usuario,
            email,
            contrasena,
        } = req.body;

        // Valida que no falte ningun campo
        if (!avatar_id || !nombre_usuario || !email || !contrasena) {
            return res.status(400).json({
                mensaje: "Todos los campos son obligatorios",
            });
        }

        // Revisa si ya existe un usuario con ese email
        const usuarioExistente = await usuarioModel.buscarUsuarioPorEmail(email);

        if (usuarioExistente) {
            return res.status(409).json({
                mensaje: "El email ya está registrado",
            });
        }

        // Crea el usuario en BD
        const nuevoUsuarioId = await usuarioModel.crearUsuario({
            avatar_id,
            nombre_usuario,
            email,
            contrasena,
        });

        // Recupera el usuario completo para devolverlo en la respuesta
        const nuevoUsuario = await usuarioModel.obtenerUsuarioPorId(nuevoUsuarioId);

        res.status(201).json({
            mensaje: "Usuario creado correctamente",
            usuario: nuevoUsuario,
        });
    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ mensaje: "Error al crear usuario" });
    }
}

// PUT /api/usuarios/:id
async function editarUsuario(req, res) {
    try {
        // Toma el ID de la URL
        const { id } = req.params;

        // Toma los nuevos datos del body
        const {
            avatar_id,
            nombre_usuario,
            email,
            contrasena,
        } = req.body;

        // Verifica que venga todo completo
        if (!avatar_id || !nombre_usuario || !email || !contrasena) {
            return res.status(400).json({
                mensaje: "Todos los campos son obligatorios",
            });
        }

        // Verifica que el usuario exista antes de editar
        const usuarioActual = await usuarioModel.obtenerUsuarioPorId(id);

        if (!usuarioActual) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado",
            });
        }

        // Evita duplicar emails entre usuarios distintos
        const usuarioConEmail = await usuarioModel.buscarUsuarioPorEmail(email);

        if (usuarioConEmail && usuarioConEmail.id != id) {
            return res.status(409).json({
                mensaje: "El email ya está registrado por otro usuario",
            });
        }

        // Ejecuta el UPDATE en BD
        const editado = await usuarioModel.editarUsuario(id, {
            avatar_id,
            nombre_usuario,
            email,
            contrasena,
        });

        if (!editado) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado",
            });
        }

        const usuarioEditado = await usuarioModel.obtenerUsuarioPorId(id);

        res.json({
            mensaje: "Usuario editado correctamente",
            usuario: usuarioEditado,
        });
    } catch (error) {
        console.error("Error al editar usuario:", error);
        res.status(500).json({ mensaje: "Error al editar usuario" });
    }
}

// DELETE /api/usuarios/:id
async function eliminarUsuario(req, res) {
    try {
        // Toma el ID de la URL
        const { id } = req.params;

        // Elimina usuario y sus relaciones
        const eliminado = await usuarioModel.eliminarUsuario(id);

        if (!eliminado) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado",
            });
        }

        res.json({
            mensaje: "Usuario eliminado correctamente",
        });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ mensaje: "Error al eliminar usuario" });
    }
}

// POST /api/usuarios/login
// Recibe: email en req.body
// Busca el usuario por email y devuelve sus datos (incluyendo contraseña)
// El frontend compara la contraseña internamente
// En Postman:
//   Method: POST
//   URL: http://localhost:3000/api/usuarios/login
//   Body -> raw -> JSON
//   {
//     "email": "juan@mail.com"
//   }
async function loginUsuario(req, res) {
    try {
        // AQUI SE RECIBE EL EMAIL DEL FRONTEND
        // req.body contiene el JSON que envió el frontend: { "email": "juan@mail.com" }
        // Se desestructura para extraer solo el email
        const { email } = req.body;

        // Valida que llegue el email
        if (!email) {
            return res.status(400).json({
                mensaje: "Email es requerido",
            });
        }

        // Busca el usuario por email en BD
        const usuarioBuscado = await usuarioModel.buscarUsuarioPorEmail(email);

        // Si no existe el usuario
        if (!usuarioBuscado) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado",
            });
        }

        // Obtiene los datos completos del usuario (con avatar y contraseña)
        const usuarioCompleto = await usuarioModel.obtenerUsuarioPorId(usuarioBuscado.id);

        // Retorna el usuario completo
        // El frontend recibirá esto y comparará la contraseña internamente
        res.json({
            mensaje: "Usuario encontrado",
            usuario: usuarioCompleto,
        });
    } catch (error) {
        console.error("Error al buscar usuario:", error);
        res.status(500).json({ mensaje: "Error al buscar usuario" });
    }
}

module.exports = {
    listarUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    editarUsuario,
    eliminarUsuario,
    loginUsuario,
};