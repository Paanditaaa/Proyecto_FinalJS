//Dependecias
const express = require('express');
const jwt = require('jsonwebtoken');
const usuarios = express.Router();
const { JsonWebTokenError } = require('jsonwebtoken');
const user = usuarios;
//Routes
const db = require('../config/database');

//Post
user.post("/login", async (req, res, next) => {
    const { user_mail, user_password } = req.body;
    const query = `SELECT * FROM usuario WHERE Nombre = '${user_mail}' AND password = '${user_password}'`
    const rows = await db.query(query);

    if (user_mail && user_password) {
        if (rows.length == 1) {
            const token = jwt.sign({
                user_id: rows[0].ID,
                usuario: rows[0].usuario
            }, "debugkey")
            return res.status(200).json({ code: 200, message: token });
        }
        else {
            return res.status(401).json({ code: 401, message: "Usuario y/o contraseña incorrecto" });
        }
    }
    return res.status(500).json({ code: 500, message: "Campos incompletos" });
})

//GET
user.get("/", async (req, res, next) => {
    const query = "SELECT * FROM usuario";
    const rows = await db.query(query);
    return res.status(200).json({ code: 200, message: rows })
})

user.get('/:name', async (req, res, next) => {
    const nombre = req.params.name;
    const usuario = await db.query(
        "SELECT * FROM usuario WHERE LOWER(usuario) LIKE LOWER(?)",
        [`%${nombre}%`]
    );
    if (usuario.length > 0) {
        return res.status(200).json({ code: 200, message: usuario });
    }
    res.status(404).json({ code: 404, message: "Usuario no encontrado" });
})

//DELETE
user.delete("/:id([0-9]{1,3})", async (req, res, next) => {
    const query = `DELETE FROM usuarios WHERE ID = '${req.params.id}'`
    const rows = await db.query(query);

    if (rows.affectedRows == 1) {
        return res.status(200).json({ code: 200, message: "Usuario borrado correctamente" });
    }
    return res.status(404).json({ code: 404, message: "Usuario no encontrado" });
})

//PUT
user.put("/:id([0-9]{1,3})", async (req, res, next) => {
    const { usuario, password } = req.body;
    const id = req.params.id;

    if (usuario && password) {
        let query = `UPDATE usuario SET usuario = ?, password = ? WHERE ID = ?`;
        const rows = await db.query(query, [usuario, password, id]);

        if (rows.affectedRows == 1) {
            return res.status(200).json({ code: 200, message: "Usuario actualizado correctamente" });
        }
        return res.status(404).json({ code: 404, message: "Usuario no encontrado" });
    }
    return res.status(400).json({ code: 400, message: "Campos incompletos" });
});

//POST - Crear nuevo usuario
user.post("/", async (req, res, next) => {
    const { usuario, password } = req.body;

    if (usuario && password) {
        let query = "INSERT INTO usuario (usuario, password) VALUES (?, ?)";
        const rows = await db.query(query, [usuario, password]);

        if (rows.affectedRows == 1) {
            return res.status(200).json({ code: 201, message: "Usuario agregado correctamente" });
        }
        return res.status(500).json({ code: 500, message: "Ocurrio un error" });
    }
    return res.status(500).json({ code: 500, message: "Campos incompletos" })
})

module.exports = user;