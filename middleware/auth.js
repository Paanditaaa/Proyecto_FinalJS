//Dependecias
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) =>{
    try{
        const token = req.header.authorization.split(" ")
        const decoded = jwt.verify(token, "debugkey")
        req.user = decoded;
        next();
    }
    catch (error){
        res.status(401);
        res.status(401).json({code: 401, message: "No cuentas con permisos"})
    }
}