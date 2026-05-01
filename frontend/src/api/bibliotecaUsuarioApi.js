/*
╔════════════════════════════════════════════════════════════════════════════════╗
║                   bibliotecaUsuarioApi.js                                      ║
║                                                                                ║
║  ¿QUÉ ES ESTO?                                                                 ║
║  Este archivo es el "teléfono" para obtener la BIBLIOTECA de un usuario.       ║
║                                                                                ║
║  ¿QUÉ INFORMACIÓN TRAE?                                                        ║
║  • El usuario (su nombre, avatar, etc.)                                        ║
║  • Sus listas/playlists (Relax, Favoritas, etc.)                              ║
║  • Las canciones de cada lista                                                 ║
║                                                                                ║
║  ES DIFERENTE DE usuarioApi.js PORQUE:                                        ║
║  usuarioApi.js = traer datos básicos de UN usuario                            ║
║  bibliotecaUsuarioApi.js = traer TODA la biblioteca (usuario + listas +       ║
║                            canciones) en UNA sola petición                     ║
║                                                                                ║
║  ¿DÓNDE SE USA?                                                                ║
║  useBiblioteca.js importa esta función y la llama para obtener datos          ║
║                                                                                ║
║  RELACIÓN CON OTROS ARCHIVOS:                                                 ║
║  axiosClient.js ─────► nos da el cliente HTTP                                ║
║       ▲                                                                        ║
║       │                                                                        ║
║  bibliotecaUsuarioApi.js ─────► lo usa para hablar con el servidor          ║
║       ▲                                                                        ║
║       │                                                                        ║
║  useBiblioteca.js ─────► lo importa y lo ejecuta                             ║
║       ▲                                                                        ║
║       │                                                                        ║
║  TopHeader.jsx (o cualquier componente) ─────► lo usa para mostrar datos    ║
║                                                                                ║
╚════════════════════════════════════════════════════════════════════════════════╝
*/

import axiosClient from "./axiosClient";

// ──────────────────────────────────────────────────────────────────────────────────
// FUNCIÓN: obtenerBibliotecaUsuario(usuarioId)
// ──────────────────────────────────────────────────────────────────────────────────
// ¿QUÉ HACE?
// Obtiene TODA la información que necesita un usuario para ver su biblioteca:
// - Sus datos personales (usuario)
// - Sus listas de reproducción (playlists)
// - Las canciones de cada lista
//
// PARÁMETRO:
// usuarioId = el ID del usuario cuya biblioteca queremos obtener
//             ejemplo: obtenerBibliotecaUsuario(1) trae la biblioteca del usuario 1
//
// ¿CÓMO FUNCIONA?
// 1. Recibe el ID del usuario
// 2. axiosClient.get() hace una petición GET al servidor
// 3. `/api/usuarios/${usuarioId}/biblioteca` es la dirección del servidor
//    Ejemplo: /api/usuarios/1/biblioteca obtiene la biblioteca del usuario 1
// 4. El servidor responde con un objeto con estructura:
//    {
//      "usuario": { id: 1, nombre_usuario: "Brandon", avatar: "..." },
//      "listas": [
//        {
//          "id": 1,
//          "nombre": "Mis Favoritas",
//          "imagen": "...",
//          "canciones": [...]
//        },
//        {...},
//      ]
//    }
// 5. response.data extrae solo los datos (sin información técnica)
// 6. return devuelve esos datos al archivo que la llamó
//
// ¿DÓNDE SE USA?
// useBiblioteca.js lo llama en su función cargar()
//
// EJEMPLO DE RESPUESTA DEL SERVIDOR:
// {
//   "usuario": {
//     "id": 1,
//     "nombre_usuario": "Brandon",
//     "avatar": "http://rasb-brandon.local:3000/media/musicbh/avatares/organicobohemio.png"
//   },
//   "listas": [
//     {
//       "id": 2,
//       "nombre": "Relax",
//       "imagen": "http://rasb-brandon.local:3000/media/musicbh/2/dosorillas.png",
//       "canciones": [
//         {
//           "id": 4,
//           "titulo": "Ceniza que Aún Arde Remix",
//           "grupo": "Dos Orillas",
//           "duracion_segundos": 214,
//           "generos": ["Darkwave Ritual", "Funeral Ambient"]
//         },
//         {...}
//       ]
//     }
//   ]
// }
//
export async function obtenerBibliotecaUsuario(usuarioId) {
    // Hacer una petición GET (obtener datos) del servidor
    const response = await axiosClient.get(`/api/usuarios/${usuarioId}/biblioteca`);
    
    // Retornar solo los datos (sin envoltorio técnico)
    return response.data;
}