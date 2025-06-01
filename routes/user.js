//Dependecias
const express = require('express');
const jwt = require('jsonwebtoken');
const datos_empleados = express.Router();
const { JsonWebTokenError } = require('jsonwebtoken');
const user = datos_empleados;
//Routes
const db = require('../config/database');

//Post
user.post("/alta", async (req, res, next) => {
    const { user_id, user_name, user_surname, user_phone, user_mail, user_address, user_password} = req.body;
    
    if (user_name && user_surname && user_phone && user_mail && user_address && user_password) {
        let query = "INSERT INTO datos_empleados (Nombre, Apellidos, Telefono, CorreoE, Direccion, Contraseña)";
        query += ` VALUES ('${user_name}','${user_surname}','${user_phone}','${user_mail}','${user_address}', '${user_password}')`;
        const rows = await db.query(query);

        if (rows.affectedRows == 1){
            return res.status(200).json({code: 201, message: "Usuario agregado correctamente"});
        }
        return res.status(500).json({code:500, message: "Ocurrio un error"});
    }
    return res.status(500).json({code:500, message: "Campos incompletos"})
})
user.post("/login", async (req, res, next) => {

    const {user_mail, user_password} = req.body;
    const query = `SELECT * FROM datos_empleados WHERE CorreoE = '${user_mail}' AND Contraseña = '${user_password}'`
    const rows = await db.query(query);

    if (user_mail && user_password){
        if(rows.length == 1){
            const token = jwt.sign({
                user_id: rows[0].user_id,
                user_mail: rows[0].user_mail
            }, "debugkey")
            return res.status(200).json({code: 200, message: token});
        }
        else{
            return res.status(401).json({code: 401, message: "Usuario y/o contraseña incorrecto"});
        }
    }
    return res.status(500).json({code: 500, message: "Campos incompletos"});
})
user.post("/", async (req, res, next) => {
    const {user_name, user_surname, user_phone, user_mail, user_address, user_password} = req.body;

    if(user_name && user_surname && user_phone && user_mail && user_address && user_password){
        let query = "INSERT INTO datos_empleados (Nombre, Apellidos, Telefono, CorreoE, Direccion, Contraseña)";
        query += `VALUES ('${user_name}','${user_surname}','${user_phone}','${user_mail}','${user_address}', '${user_password}')`;
        const rows = await db.query(query);

        if (rows.affectedRows == 1){
            return res.status(200).json({code: 201, message: "Usuario agregado correctamente"});
        }
        return res.status(500).json({code:500, message: "Ocurrio un error"});
    }
    return res.status(500).json({code:500, message: "Campos incompletos"})
})
//GET
user.get("/", async (req, res, next) => {
    const query = "SELECT * FROM datos_empleados";
    const rows = await db.query(query);
    return res.status(200).json({code:200, message: rows})
})
user.get('/:name', async (req, res, next) => {
    const nombre = req.params.name;
    const usuario = await db.query(
        "SELECT * FROM datos_empleados WHERE LOWER(Nombre) LIKE LOWER(?)",
        [`%${nombre}%`]
    );
    if (usuario.length > 0) {
        return res.status(200).json({code: 200, message: usuario});
    }
    res.status(404).json({code:404, message: "Usuario no encontrado"});
})
//DELETE
user.delete("/:id([0-9]{1,3})", async (req, res, next) => {
    const query = `DELETE FROM datos_empleados WHERE ID = '${req.params.id}'`
    const rows = await db.query(query);

    if(rows.affectedRows == 1) {
        return res.status(200).json({code: 200, message: "Usuario borrado correctamente"});
    } 
    return res.status(404).json({code:404, message: "Usuario no encontrado"});
})
//Put
user.put("/:id([0-9]{1,3})", async (req, res, next) => {
    const { user_name, user_surname, user_phone, user_mail, user_address, user_password } = req.body;
    const id = req.params.id;

    if (user_name && user_surname && user_phone && user_mail && user_address && user_password) {
        let query = `UPDATE datos_empleados SET Nombre = ?, Apellidos = ?, Telefono = ?, CorreoE = ?, Direccion = ?, Contraseña = ? WHERE ID = ?`;
        const rows = await db.query(query, [user_name, user_surname, user_phone, user_mail, user_address, user_password, id]);

        if (rows.affectedRows == 1) {
            return res.status(200).json({ code: 200, message: "Usuario actualizado correctamente" });
        }
        return res.status(404).json({ code: 404, message: "Usuario no encontrado" });
    }
    return res.status(400).json({ code: 400, message: "Campos incompletos" });
});
module.exports = user;