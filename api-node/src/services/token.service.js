const jwt = require("jsonwebtoken");

// N: Servicio de tokens
// N: Genera JWT firmados que se usan para autenticar peticiones hacia rutas protegidas.
// N: El token contiene datos mínimos del usuario (id, email, nombre) y un `expiresIn`.
// N: `process.env.JWT_SECRET` debe estar definido y protegido en variables de entorno.
function generateToken(usuario) {
    return jwt.sign(
        {
            id: usuario.id,
            email: usuario.email,
            nombre_usuario: usuario.nombre_usuario,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "2h",
        }
    );
}

module.exports = {
    generateToken,
};