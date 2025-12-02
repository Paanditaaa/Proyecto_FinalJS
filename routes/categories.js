const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/categories - Obtener todas las categorías
router.get("/", async (req, res, next) => {
    try {
        const query = "SELECT * FROM categoria";
        const rows = await db.query(query);
        return res.status(200).json({ code: 200, message: rows });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return res.status(500).json({ code: 500, message: "Error al obtener categorías" });
    }
});

// POST /api/categories - Crear una nueva categoría
router.post("/", async (req, res, next) => {
    try {
        const { Nombre } = req.body;
        const query = "INSERT INTO categoria (Nombre) VALUES (?)";
        await db.query(query, [Nombre]);
        return res.status(201).json({ code: 201, message: "Categoría creada exitosamente" });
    } catch (error) {
        console.error("Error creating category:", error);
        return res.status(500).json({ code: 500, message: "Error al crear la categoría" });
    }
});

module.exports = router;
