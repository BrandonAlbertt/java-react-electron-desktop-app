import axiosClient from "./axiosClient";

/*
|--------------------------------------------------------------------------
| LISTAS API
|--------------------------------------------------------------------------
| Este archivo contiene las funciones para comunicarse con el backend
| relacionadas con las listas de reproducción.
|
| Aquí NO se maneja estado de React.
| Solo se hacen peticiones HTTP usando axiosClient.
*/

// ===============================
// OBTENER LISTAS DE UN USUARIO
// ===============================
// GET /api/usuarios/:usuarioId/listas
export async function obtenerListasUsuario(usuarioId) {
    const response = await axiosClient.get(`/api/usuarios/${usuarioId}/listas`);
    return response.data;
}

// ===============================
// CREAR UNA LISTA PARA UN USUARIO
// ===============================
// POST /api/usuarios/:usuarioId/listas
export async function crearListaUsuario(usuarioId, data) {
    const response = await axiosClient.post(`/api/usuarios/${usuarioId}/listas`, data);
    return response.data;
}

// ===============================
// AGREGAR CANCIÓN A UNA LISTA
// ===============================
// POST /api/listas/:listaId/canciones/:cancionId
export async function agregarCancionALista(listaId, cancionId) {
    const response = await axiosClient.post(
        `/api/listas/${listaId}/canciones/${cancionId}`
    );

    return response.data;
}

// ===============================
// QUITAR CANCIÓN DE UNA LISTA
// ===============================
// DELETE /api/listas/:listaId/canciones/:cancionId
export async function quitarCancionDeLista(listaId, cancionId) {
    const response = await axiosClient.delete(
        `/api/listas/${listaId}/canciones/${cancionId}`
    );

    return response.data;
}

// ===============================
// ELIMINAR UNA LISTA COMPLETA
// ===============================
// DELETE /api/listas/:listaId
export async function eliminarLista(listaId) {
    const response = await axiosClient.delete(`/api/listas/${listaId}`);
    return response.data;
}

export async function renombrarLista(listaId, nuevoNombre) {
    const respose = await axiosClient.put(`/api/listas/${listaId}/`);
    return respose.data;
    
}