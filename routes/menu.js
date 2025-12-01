const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/menu - Obtener todos los platillos del menú
router.get("/", async (req, res, next) => {
    try {
        const query = "SELECT * FROM platillo";
        const rows = await db.query(query);
        return res.status(200).json({ code: 200, message: rows });
    } catch (error) {
        console.error("Error fetching menu:", error);
        return res.status(500).json({ code: 500, message: "Error al obtener el menú" });
    }
});

module.exports = router;
