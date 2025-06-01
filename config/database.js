//Dependecias
const mysql = require('mysql');
const util = require('util');

//Conexion a la base de datos
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'proyectofinal'
})

pool.query = util.promisify(pool.query);

module.exports = pool;