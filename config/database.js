const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

// Conexión MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "proyectofinal"
});

// Endpoint LOGIN
app.post("/api/login", (req, res) => {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
        return res.status(400).json({ message: "Datos incompletos" });
    }

    const query = "SELECT * FROM usuarios WHERE usuario = ?";

    db.query(query, [usuario], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error en la base de datos" });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }

        const user = results[0];

        // Si no usas bcrypt
        if (user.password !== password) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        // Crear token
        const token = jwt.sign(
            { id: user.id, usuario: user.usuario },
            "CLAVE_SECRETA",
            { expiresIn: "2h" }
        );

        res.json({
            message: "Login exitoso",
            token
        });
    });
});

// Iniciar servidor
app.listen(3000, () => {
    console.log("Servidor ejecutándose en http://localhost:3000");
});
