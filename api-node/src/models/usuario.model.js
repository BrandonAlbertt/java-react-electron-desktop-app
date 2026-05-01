// MODEL DE USUARIOS
// Relacion: controller -> model -> BD
// Este archivo consulta y modifica la base de datos

const db = require("../config/db");

// N: Model de usuarios
// N: Este módulo realiza las consultas a la base de datos (CRUD).
// N: Importante: el campo `contrasena` en la tabla `usuarios` almacena el HASH (bcrypt),
// N: nunca contraseñas en texto plano. Los controladores usan `password.service` para
// N: hashear antes de guardar y `comparePassword` para comprobar en login.

// Trae todos los usuarios con datos del avatar
async function listarUsuarios() {
    const [rows] = await db.query(`
        SELECT
            u.id,
            u.avatar_id,
            a.nombre AS avatar_nombre,
            a.imagen_url AS avatar_imagen,
            u.nombre_usuario,
            u.email
        FROM usuarios u
        INNER JOIN avatares a
            ON u.avatar_id = a.id
        ORDER BY u.id DESC
    `);

    return rows;
}

// Busca un usuario por ID con avatar
async function obtenerUsuarioPorId(id) {
    const [rows] = await db.query(`
        SELECT
            u.id,
            u.avatar_id,
            a.nombre AS avatar_nombre,
            a.imagen_url AS avatar_imagen,
            u.nombre_usuario,
            u.email
        FROM usuarios u
        INNER JOIN avatares a
            ON u.avatar_id = a.id
        WHERE u.id = ?
    `, [id]);

    return rows[0] || null;
}

// Inserta un usuario nuevo en la tabla usuarios
async function crearUsuario({ avatar_id, nombre_usuario, email, contrasena }) {
    const [result] = await db.query(`
        INSERT INTO usuarios (
            avatar_id,
            nombre_usuario,
            email,
            contrasena
        )
        VALUES (?, ?, ?, ?)
    `, [avatar_id, nombre_usuario, email, contrasena]);

    return result.insertId;
}

// Actualiza los datos de un usuario existente
async function editarUsuario(id, { avatar_id, nombre_usuario, email, contrasena }) {
    const [result] = await db.query(`
        UPDATE usuarios
        SET
            avatar_id = ?,
            nombre_usuario = ?,
            email = ?,
            contrasena = ?
        WHERE id = ?
    `, [avatar_id, nombre_usuario, email, contrasena, id]);

    return result.affectedRows > 0;
}

// Elimina el usuario y primero borra sus relaciones
async function eliminarUsuario(id) {
    const connection = await db.getConnection();

    try {
        // Inicia transaccion para evitar datos incompletos
        await connection.beginTransaction();

        // Primero elimina canciones de listas del usuario
        await connection.query(`
            DELETE lm
            FROM lista_musica_m lm
            INNER JOIN lista_musicales l
                ON lm.lista_id = l.id
            WHERE l.usuario_id = ?
        `, [id]);

        // Luego elimina las listas del usuario
        await connection.query(`
            DELETE FROM lista_musicales
            WHERE usuario_id = ?
        `, [id]);

        // Finalmente elimina el usuario
        const [result] = await connection.query(`
            DELETE FROM usuarios
            WHERE id = ?
        `, [id]);

        // Confirma todos los cambios
        await connection.commit();

        return result.affectedRows > 0;
    } catch (error) {
        // Si algo falla, deshace todo
        await connection.rollback();
        throw error;
    } finally {
        // Libera la conexion siempre
        connection.release();
    }
}

// Busca un usuario por email para evitar duplicados
async function buscarUsuarioPorEmail(email) {
    const [rows] = await db.query(`
        SELECT
            id,
            avatar_id,
            nombre_usuario,
            email,
            contrasena
        FROM usuarios
        WHERE email = ?
    `, [email]);

    return rows[0] || null;
}

module.exports = {
    listarUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    editarUsuario,
    eliminarUsuario,
    buscarUsuarioPorEmail,
};