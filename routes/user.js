// Dependencies
const express = require('express');
const jwt = require('jsonwebtoken');
const usuarios = express.Router();
const user = usuarios;
// Routes
const db = require('../config/database');

// Post - LOGIN (Ruta: /api/user/login)
user.post("/login", async (req, res, next) => {
    // El frontend envía user_mail y user_password
    const { user_mail, user_password } = req.body;

    if (!user_mail || !user_password) {
        return res.status(400).json({ code: 400, message: "Campos incompletos" });
    }

    // 💡 CONSULTA CORREGIDA usando los nombres exactos de tu tabla: Nombre, Password, Rol
    const query = `SELECT IDUsuario, Nombre, Password, Rol FROM usuario WHERE Nombre = ? AND Password = ?`;

    // Usar placeholders para mayor seguridad
    const rows = await db.query(query, [user_mail, user_password]);

    if (rows.length === 1) {
        const dbUser = rows[0];

        const token = jwt.sign({
            user_id: dbUser.IDUsuario,
            usuario: dbUser.Nombre, // Nombre de usuario en el token
            role: dbUser.Rol // Rol en el token
        }, "debugkey");

        // Respuesta exitosa: devolver token y rol en minúsculas
        return res.status(200).json({
            code: 200,
            token: token,
            role: dbUser.Rol.toLowerCase() // Asegura que sea 'admin' si la BD tiene 'Admin'
        });
    }

    // Respuesta de fallo (401)
    return res.status(401).json({ code: 401, message: "Usuario y/o contraseña incorrecto" });
});

// GET
user.get("/", async (req, res, next) => {
    const query = "SELECT * FROM usuario";
    const rows = await db.query(query);
    return res.status(200).json({ code: 200, message: rows })
});

user.get('/:name', async (req, res, next) => {
    const nombre = req.params.name;
    // La búsqueda debe usar el campo 'Nombre'
    const usuario = await db.query(
        "SELECT * FROM usuario WHERE LOWER(Nombre) LIKE LOWER(?)",
        [`%${nombre}%`]
    );
    if (usuario.length > 0) {
        return res.status(200).json({ code: 200, message: usuario });
    }
    res.status(404).json({ code: 404, message: "Usuario no encontrado" });
})

// DELETE
user.delete("/:id([0-9]{1,3})", async (req, res, next) => {
    const query = `DELETE FROM usuario WHERE IDUsuario = '${req.params.id}'` // Usar IDUsuario
    const rows = await db.query(query);

    if (rows.affectedRows === 1) {
        return res.status(200).json({ code: 200, message: "Usuario borrado correctamente" });
    }
    return res.status(404).json({ code: 404, message: "Usuario no encontrado" });
});

// PUT
user.put("/:id([0-9]{1,3})", async (req, res, next) => {
    // 💡 Asumo que el PUT actualiza Nombre y Password, no 'usuario'
    const { Nombre, Password } = req.body;
    const id = req.params.id;

    if (Nombre && Password) {
        let query = `UPDATE usuario SET Nombre = ?, Password = ? WHERE IDUsuario = ?`;
        const rows = await db.query(query, [Nombre, Password, id]);

        if (rows.affectedRows === 1) {
            return res.status(200).json({ code: 200, message: "Usuario actualizado correctamente" });
        }
        return res.status(404).json({ code: 404, message: "Usuario no encontrado" });
    }
    return res.status(400).json({ code: 400, message: "Campos incompletos" });
});

// POST - Crear nuevo usuario
user.post("/", async (req, res, next) => {
    // 💡 Asumo que el POST usa Nombre y Password
    const { Nombre, Password, Rol } = req.body;

    if (Nombre && Password) {
        let query = "INSERT INTO usuario (Nombre, Password, Rol) VALUES (?, ?, ?)";
        const rows = await db.query(query, [Nombre, Password, Rol || 'user']); // Rol por defecto 'user'

        if (rows.affectedRows === 1) {
            return res.status(201).json({ code: 201, message: "Usuario agregado correctamente" });
        }
        return res.status(500).json({ code: 500, message: "Ocurrio un error" });
    }
    return res.status(400).json({ code: 400, message: "Campos incompletos" });
})

module.exports = user;