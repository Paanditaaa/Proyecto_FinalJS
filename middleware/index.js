module.exports = (req, res, next) => {
    res.status(200).json({code: 1, message: "Bienvenido a la base de datos de Taller de Node.js S.A. de C.V."})
}