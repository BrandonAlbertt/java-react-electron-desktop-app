const mysql = require('mysql2/promise');
// Carga las variables del archivo .env en process.env
require('dotenv').config();

// Este archivo crea y exporta el pool de conexiones a MySQL.
// La configuración sale de .env (DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME).
const pool = mysql.createPool({
    // Host del servidor MySQL (tomado de .env)
    host: process.env.DB_HOST,
    // Puerto de MySQL (tomado de .env)
    port: process.env.DB_PORT,
    // Usuario de MySQL (tomado de .env)
    user: process.env.DB_USER,
    // Contraseña de MySQL (tomada de .env)
    password: process.env.DB_PASSWORD,
    // Base de datos a usar (tomada de .env)
    database: process.env.DB_NAME,

    // Mantiene conexiones listas para reutilizar y mejorar rendimiento
    waitForConnections: true,
    // Cantidad máxima de conexiones abiertas al mismo tiempo
    connectionLimit: 10,
});

// Se exporta para usar la misma conexión en controladores y servicios
module.exports = pool;