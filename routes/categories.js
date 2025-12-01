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

module.exports = router;
