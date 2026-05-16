// N: Importa funciones de cifrado y autenticación
// N: hashPassword y comparePassword usan bcrypt para cifrar/verificar contraseñas
const { hashPassword, comparePassword } = require("../services/password.service");
// N: generateToken crea un JWT firmado con datos del usuario
const { generateToken } = require("../services/token.service");

// N: usuarioModel conecta con la base de datos y expone funciones CRUD
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

// N: REGISTRO DE USUARIO
// N: Recibe datos del usuario, verifica duplicados, cifra la contraseña y guarda en BD
// N: Al crear el usuario, genera un JWT para autenticación inmediata
async function crearUsuario(req, res) {
    try {
        // estos nombres de campos deben coincidir con los que envía el frontend en el body
        const {
            avatar_id,
            nombre_usuario,
            email,
            contrasena,
        } = req.body;

        // N: Validación de campos obligatorios
        if (!avatar_id || !nombre_usuario || !email || !contrasena) {
            return res.status(400).json({
                mensaje: "Todos los campos son obligatorios",
            });
        }

        // N: Verifica si el email ya está registrado
        const usuarioExistente = await usuarioModel.buscarUsuarioPorEmail(email);
        if (usuarioExistente) {
            return res.status(409).json({
                mensaje: "El email ya está registrado",
            });
        }

        // N: Cifra la contraseña usando bcrypt antes de guardar
        const contrasenaHash = await hashPassword(contrasena);

        // N: Guarda el usuario en la base de datos con la contraseña cifrada
        const nuevoUsuarioId = await usuarioModel.crearUsuario({
            avatar_id,
            nombre_usuario,
            email,
            contrasena: contrasenaHash,
        });

        // N: Obtiene el usuario recién creado (sin contraseña)
        const nuevoUsuario = await usuarioModel.obtenerUsuarioPorId(nuevoUsuarioId);

        // N: Genera un token JWT para el usuario
        const token = generateToken(nuevoUsuario);

        res.status(201).json({
            mensaje: "Usuario creado correctamente",
            token,
            usuario: nuevoUsuario,
        });
    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ mensaje: "Error al crear usuario" });
    }
}

// N: EDICIÓN DE USUARIO
// N: Permite modificar datos y actualiza la contraseña cifrada si se envía
async function editarUsuario(req, res) {
    try {
        // N: Obtiene el ID del usuario a editar
        const { id } = req.params;

        // N: Extrae los nuevos datos del body
        const {
            avatar_id,
            nombre_usuario,
            email,
            contrasena,
        } = req.body;

        // N: Valida que todos los campos estén presentes
        if (!avatar_id || !nombre_usuario || !email || !contrasena) {
            return res.status(400).json({
                mensaje: "Todos los campos son obligatorios",
            });
        }

        // N: Verifica que el usuario exista
        const usuarioActual = await usuarioModel.obtenerUsuarioPorId(id);
        if (!usuarioActual) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado",
            });
        }

        // N: Evita duplicar emails entre usuarios distintos
        const usuarioConEmail = await usuarioModel.buscarUsuarioPorEmail(email);
        if (usuarioConEmail && usuarioConEmail.id != id) {
            return res.status(409).json({
                mensaje: "El email ya está registrado por otro usuario",
            });
        }

        // N: Cifra la nueva contraseña antes de actualizar
        const contrasenaHash = await hashPassword(contrasena);

        // N: Actualiza el usuario en la base de datos
        const editado = await usuarioModel.editarUsuario(id, {
            avatar_id,
            nombre_usuario,
            email,
            contrasena: contrasenaHash,
        });

        if (!editado) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado",
            });
        }

        // N: Devuelve el usuario editado (sin contraseña)
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

// N: LOGIN DE USUARIO
// N: Recibe email y contraseña, busca el usuario y compara la contraseña cifrada
// N: Si es correcto, genera y devuelve un JWT para autenticación
async function loginUsuario(req, res) {
    try {
        const { email, contrasena } = req.body;

        // N: Valida que se envíen email y contraseña
        if (!email || !contrasena) {
            return res.status(400).json({
                mensaje: "Email y contraseña son obligatorios",
            });
        }

        // N: Busca el usuario por email
        const usuarioBuscado = await usuarioModel.buscarUsuarioPorEmail(email);
        if (!usuarioBuscado) {
            return res.status(401).json({
                mensaje: "Credenciales incorrectas",
            });
        }

        // N: Compara la contraseña enviada con el hash guardado usando bcrypt
        const passwordOk = await comparePassword(
            contrasena,
            usuarioBuscado.contrasena
        );
        if (!passwordOk) {
            return res.status(401).json({
                mensaje: "Credenciales incorrectas",
            });
        }

        // N: Genera un token JWT para el usuario autenticado
        const token = generateToken(usuarioBuscado);

        res.json({
            mensaje: "Login correcto",
            token,
            usuario: {
                id: usuarioBuscado.id,
                avatar_id: usuarioBuscado.avatar_id,
                nombre_usuario: usuarioBuscado.nombre_usuario,
                email: usuarioBuscado.email,
            },
        });
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({ mensaje: "Error al iniciar sesión" });
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