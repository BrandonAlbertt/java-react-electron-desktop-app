import axios from "axios";

// Importamos axios, una herramienta para "hablar" con el servidor por HTTP.
// Piensa en axios como un mensajero que envia peticiones y trae respuestas.

// Cliente HTTP compartido del frontend.
// Sirve para centralizar la URL base de la API y headers comunes,
// evitando repetir configuracion en cada archivo (explorarApi, musicaApi, etc.).
// La URL se configura en el archivo .env del proyecto.
const axiosClient = axios.create({
    // baseURL es la direccion principal del backend.
    // Todas las rutas como /api/explorar se pegan a esta base automaticamente.
    // Ejemplo: baseURL + /api/explorar = http://rasb-brandon.local:3000/api/explorar
    baseURL: import.meta.env.VITE_API_URL,

    // headers son datos extras que viajan con cada peticion.
    // "Content-Type: application/json" le dice al servidor:
    // "te envio informacion en formato JSON".
    headers: {
        "Content-Type": "application/json",
    },
});

// Exportamos este cliente para reutilizarlo en otros archivos del proyecto.
// Asi todos usan la misma configuracion y se evitan errores por diferencias.
export default axiosClient;