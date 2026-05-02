/*
╔══════════════════════════════════════════════════════════════════════════════╗
║                          usuarioApi.js                                        ║
║                                                                                ║
║  ¿QUÉ ES ESTO?                                                                 ║
║  Este archivo es como un "teléfono" que comunica la app con el servidor.      ║
║  Aquí están las funciones que "hablan" con el backend para obtener, crear,     ║
║  editar y eliminar usuarios.                                                   ║
║                                                                                ║
║  CÓMO FUNCIONA:                                                                ║
║  1. Importamos axios (cliente HTTP) desde axiosClient.js                      ║
║  2. Cada función aquí hace una petición HTTP (GET, POST, PUT, DELETE)         ║
║  3. Las respuestas vienen del servidor y se devuelven aquí                    ║
║  4. Otros archivos importan estas funciones para usarlas                      ║
║                                                                                ║
║  RELACIÓN CON OTROS ARCHIVOS:                                                 ║
║  axiosClient.js → nos da el cliente HTTP                                      ║
║  useUsuario.js → usa estas funciones para hacer el hook                       ║
║  componentes → usan useUsuario.js que a su vez usa estas funciones            ║
║                                                                                ║
║  EJEMPLO DE FLUJO:                                                             ║
║  Componente → useUsuario() → usuarioApi.js → axiosClient → servidor          ║
╚══════════════════════════════════════════════════════════════════════════════╝
*/

import axiosClient from "./axiosClient";

// ─────────────────────────────────────────────────────────────────────────
// FUNCIÓN 1: listarUsuarios()
// ─────────────────────────────────────────────────────────────────────────
// ¿QUÉ HACE?
// Obtiene la lista de TODOS los usuarios del servidor
//
// ¿CÓMO FUNCIONA?
// 1. axiosClient.get() hace una petición GET al servidor
// 2. "/api/usuarios" es la dirección del servidor donde están los usuarios
// 3. El servidor responde con una lista de usuarios
// 4. response.data extrae solo los datos (sin información técnica)
// 5. return devuelve esos datos al archivo que la llamó
//
// ¿DÓNDE SE USA?
// useUsuario.js lo llama en la función cargarUsuarios()
//
export async function listarUsuarios() {
    const response = await axiosClient.get("/api/usuarios");
    return response.data;
}

// ─────────────────────────────────────────────────────────────────────────
// FUNCIÓN 2: obtenerUsuarioPorId(usuarioId)
// ─────────────────────────────────────────────────────────────────────────
// ¿QUÉ HACE?
// Obtiene UN usuario específico del servidor usando su ID
// (ID = número único que identifica a cada usuario, como su carné)
//
// PARÁMETRO:
// usuarioId = el ID del usuario que queremos obtener
//             ejemplo: obtenerUsuarioPorId(1) obtiene al usuario con ID 1
//
// ¿CÓMO FUNCIONA?
// 1. Recibe el ID como parámetro (usuarioId)
// 2. Lo coloca en la URL: "/api/usuarios/1" si el ID es 1
// 3. El servidor busca ese usuario y lo devuelve
// 4. Retorna solo los datos de ese usuario
//
// ¿DÓNDE SE USA?
// useUsuario.js lo llama en cargarUsuarioPorId(id)
//
export async function obtenerUsuarioPorId(usuarioId) {
    const response = await axiosClient.get(`/api/usuarios/${usuarioId}`);
    return response.data;
}

// ─────────────────────────────────────────────────────────────────────────
// FUNCIÓN 3: crearUsuario(data)
// ─────────────────────────────────────────────────────────────────────────
// ¿QUÉ HACE?
// Crea un nuevo usuario en el servidor
//
// PARÁMETRO:
// data = objeto con la información del nuevo usuario
//        ejemplo: { nombre: "Juan", email: "juan@mail.com" }
//
// ¿CÓMO FUNCIONA?
// 1. axiosClient.post() envía datos NUEVOS al servidor
// 2. "/api/usuarios" es donde el servidor guarda nuevos usuarios
// 3. data es la información del nuevo usuario
// 4. El servidor crea el usuario y devuelve la confirmación
// 5. Retorna los datos del usuario ya creado
//
// ¿DÓNDE SE USA?
// useUsuario.js lo llama en registrarUsuario(data)
//
export async function crearUsuario(data) {
    const response = await axiosClient.post("/api/usuarios", data);
    return response.data;
}

// ─────────────────────────────────────────────────────────────────────────
// FUNCIÓN 4: editarUsuario(usuarioId, data)
// ─────────────────────────────────────────────────────────────────────────
// ¿QUÉ HACE?
// Modifica/actualiza la información de un usuario existente
//
// PARÁMETROS:
// usuarioId = el ID del usuario a modificar
// data = los nuevos datos del usuario
//        ejemplo: { nombre: "Juan Actualizado" }
//
// ¿CÓMO FUNCIONA?
// 1. axiosClient.put() actualiza datos existentes
// 2. "/api/usuarios/1" especifica CUÁL usuario editar (el ID)
// 3. data contiene los nuevos valores
// 4. El servidor guarda los cambios
// 5. Retorna el usuario con los datos ya actualizados
//
// ¿DÓNDE SE USA?
// useUsuario.js lo llama en actualizarUsuario(id, data)
//
export async function editarUsuario(usuarioId, data) {
    const response = await axiosClient.put(`/api/usuarios/${usuarioId}`, data);
    return response.data;
}

// ─────────────────────────────────────────────────────────────────────────
// FUNCIÓN 5: eliminarUsuario(usuarioId)
// ─────────────────────────────────────────────────────────────────────────
// ¿QUÉ HACE?
// Borra un usuario del servidor
//
// PARÁMETRO:
// usuarioId = el ID del usuario a borrar
//
// ¿CÓMO FUNCIONA?
// 1. axiosClient.delete() borra datos del servidor
// 2. "/api/usuarios/1" especifica CUÁL usuario borrar
// 3. El servidor elimina ese usuario
// 4. Retorna una confirmación
//
// ¿DÓNDE SE USA?
// useUsuario.js lo llama en borrarUsuario(id)
//
export async function eliminarUsuario(usuarioId) {
    const response = await axiosClient.delete(`/api/usuarios/${usuarioId}`);
    return response.data;
}


export async function loginUsuario(data) {
    // API CONNECTION: POST /api/usuarios/login
    // SENDS: { email, contrasena }
    // RETURNS: { mensaje, token, usuario }
    const response = await axiosClient.post("/api/usuarios/login", data);
    return response.data;
}