// N: Middleware de autenticación
// N: Se encarga de verificar que la petición incluya un header `Authorization: Bearer <token>`
// N: Usa `jwt.verify` con el mismo `JWT_SECRET` que `token.service.generateToken` para validar el token.
// N: Si el token es válido, añade `req.usuario` con los datos decodificados y llama a `next()`.
// N: Si no, responde con 401.

const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            mensaje: "Acceso denegado. Token no enviado",
        });
    }

    const partes = authHeader.split(" ");

    if (partes.length !== 2 || partes[0] !== "Bearer") {
        return res.status(401).json({
            mensaje: "Formato de token inválido",
        });
    }

    const token = partes[1];

    try {
        // N: Verifica el token con el secreto (mismo secreto usado para firmarlo)
        const usuarioDecodificado = jwt.verify(token, process.env.JWT_SECRET);

        // N: Guardamos los datos del usuario del token en req para que los controladores los usen
        req.usuario = usuarioDecodificado;

        next();
    } catch (error) {
        return res.status(401).json({
            mensaje: "Token inválido o expirado",
        });
    }
}

module.exports = authMiddleware;
