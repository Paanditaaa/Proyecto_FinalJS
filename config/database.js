const mysql = require("mysql");
const util = require("util");

// Conexión MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "proyectofinal"
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error("Error conectando a la base de datos:", err);
        return;
    }
    console.log("Conectado a la base de datos MySQL");
});

// Convertir db.query a una función que retorna promesas
db.query = util.promisify(db.query);

module.exports = db;
