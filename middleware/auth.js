//Dependecias
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // 1. Acceder correctamente al encabezado 'headers' y usar [1] para tomar solo el token
        const token = req.headers.authorization.split(" ")[1];

        // 2. Verificar el token con la clave secreta
        const decoded = jwt.verify(token, "debugkey");

        // 3. Adjuntar la información decodificada (el payload) a la solicitud
        req.user = decoded;

        // 4. Continuar con la ruta
        next();
    }
    catch (error) {
        // Enviar una única respuesta de error 401
        return res.status(401).json({
            code: 401,
            message: "No cuentas con permisos. Token inválido o ausente."
        });
    }
}