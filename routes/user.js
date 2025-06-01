const express = require('express');
const jwt = require('jsonwebtoken')
const user = express.Router();
const db = require('../config/database');
const { JsonWebTokenError } = require('jsonwebtoken');

user.post("/signin", async (req, res, next) => {


    const { user_id, user_name,user_surname, user_phone, user_mail,user_adress, user_password} = req.body;
    if (user_name && user_surname && user_phone && user_mail && user_adress && user_password) {
        let query = "INSERT INTO datos_empleados (nombre, apellido, telefono, correoe, direccion, contraseña)"
        query += `VALUES ('${user_name}', '${user_surname}','${user_phone}'.'${user_mail}', '${user_adress}','${user_password}')`;
    
        const rows = await db.query(query);

        if(rows.affectedRows == 1) {
            return res.status(201).json({code: 201, message: "Usuario registrado correctamente"})
        }
        return res.status(500).json({code: 500, message: "Ocurrio un error."})
    }
    return res.status(500).json({code: 500, message: "Campos incompletos."})
})
user.post("/login", async (req, res, next) => {

    const { user_mail, user_password } = req.body;
    const query = `SELECT * FROM datos_empleados WHERE user_mail = '${user_mail}' AND user_password = '${user_password}';` 
    const rows = await db.query(query);
    
    if (user_mail && user_password){
        if(rows.length == 1) {
            const token = jwt.sign({
                user_id: rows[0].user_id,
                user_mail: rows[0].user_mail
            }, "debugkey")
            return res.status(200).json({code: 200, message: token});
        }
        else{
    
            return res.status(200).json({code: 401, message:"Usuario y/o contraseña incorrecto"});
        }
    }
    return res.status(500).json({code: 500, message: "Campos incompletos"});
})
user.get("/", async (req, res, next) => {
    const query = "SELECT * FROM datos_empleados";
    const rows = await db.query(query)

    return res.status(200).json({code:200, message: rows})
})
/*
user.get("/:name([A-Za-z]))", async (req, res, next) => {
    const name = req.params.name;
    const usuario = await db.query("SELECT * FROM datos_empleados WHERE Nombre ='"+name+"'");
    if (usuario.length > 0) {
        return res.status(200).json({code: 1, message: usuario});
    } 
    res.status(404).json({code:404, message: "Usuario no encontrado"})
})*/
user.get("/:name([A-Za-z]+)/", async (req, res, next) => {
     const name = req.params.name;
     const usuario = await db.query("SELECT * FROM datos_empleados WHERE Nombre ='"+name+"'");
     if (usuario.length > 0) {
         return res.status(200).json({code: 1, message: usuario});
     }
     res.status(404).json({code:404, message: "Usuario no encontrado"})
 });
module.exports = user;