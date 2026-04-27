// Importa las funciones que manejan la base de datos (usuario.model.js)
// En el model se exportan functions como crearUsuario(busca/crea en la DB).
const usuarioModel = require("../models/usuario.model");

// Controlador para crear un usuario.
// Relación con otros archivos:
// - app.js monta la ruta base: app.use('/api/usuarios', usuarioRoutes)
// - routes/usuario.routes.js define POST '/' que llama a esta función
// - models/usuario.model.js contiene la lógica SQL (insert, select)
async function crearUsuario(req, res) {
    try {
        // Los datos del usuario vienen en el cuerpo de la petición (req.body)
        // En Postman debes enviar un JSON en el body, por ejemplo:
        // {
        //   "avatar_id": 1,
        //   "nombre_usuario": "juan",
        //   "email": "juan@mail.com",
        //   "contrasena": "miPassword"
        // }
        const {
            avatar_id,
            nombre_usuario,
            email,
            contrasena,
        } = req.body;

        // Validación básica: todos los campos obligatorios
        // Si falta algo, respondemos 400 Bad Request
        if (!avatar_id || !nombre_usuario || !email || !contrasena) {
            return res.status(400).json({
                mensaje: "Todos los campos son obligatorios",
            });
        }

        // Usa el model para buscar si ya existe el email
        // buscarUsuarioPorEmail está en usuario.model.js y hace SELECT en la DB
        const usuarioExistente = await usuarioModel.buscarUsuarioPorEmail(email);

        // Si existe, respondemos 409 Conflict
        if (usuarioExistente) {
            return res.status(409).json({
                mensaje: "El email ya está registrado",
            });
        }

        // Llama al model para insertar el usuario en la DB.
        // crearUsuario retorna el id (insertId) del nuevo registro.
        const nuevoUsuarioId = await usuarioModel.crearUsuario({
            avatar_id,
            nombre_usuario,
            email,
            contrasena,
        });

        // Respuesta 201 Created con datos básicos del nuevo usuario
        res.status(201).json({
            mensaje: "Usuario creado correctamente",
            usuario: {
                id: nuevoUsuarioId,
                avatar_id,
                nombre_usuario,
                email,
            },
        });
    } catch (error) {
        // Errores inesperados: registrar en consola y devolver 500
        console.error("Error al crear usuario:", error);

        res.status(500).json({
            mensaje: "Error al crear usuario",
        });
    }
}

module.exports = {
    crearUsuario,
};