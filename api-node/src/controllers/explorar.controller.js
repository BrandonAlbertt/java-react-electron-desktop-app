// Importa TODO lo exportado por explorar.model.js en un objeto llamado explorarModel.
// En el model se exporta:
// { obtenerGeneros, obtenerGrupos, obtenerCanciones }
// Por eso aquí se usan como:
// explorarModel.obtenerGeneros(), explorarModel.obtenerGrupos(), explorarModel.obtenerCanciones().
const explorarModel = require("../models/explorar.model");

// Controlador: recibe la petición HTTP y arma la respuesta para el cliente.
async function obtenerDatosExplorar(req, res) {
    try {
        // Llama al model para traer datos de la base de datos.
        // El controller no escribe SQL: eso queda en el model.
        const generos = await explorarModel.obtenerGeneros();
        const grupos = await explorarModel.obtenerGrupos();
        const canciones = await explorarModel.obtenerCanciones();

        // Devuelve todo en un solo JSON para la pantalla "Explorar".
        res.json({
            generos,
            grupos,
            canciones,
        });
    } catch (error) {
        // Si algo falla (DB, consulta, etc.), registra el error en consola.
        console.error("Error al obtener datos de explorar:", error);

        // Respuesta HTTP 500 = error interno del servidor.
        res.status(500).json({
            mensaje: "Error al obtener datos de explorar",
        });
    }
}

// Exporta esta función para que la ruta la pueda usar.
module.exports = {
    obtenerDatosExplorar,
};