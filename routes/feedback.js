const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Endpoint para reportar un error
router.post('/report', async (req, res) => {
    const { reporte } = req.body;

    if (!reporte) {
        return res.status(400).json({ error: 'El contenido del reporte es requerido' });
    }

    try {
        const query = "INSERT INTO reporte (Reporte, Fecha) VALUES (?, NOW())";
        await db.query(query, [reporte]);
        res.status(201).json({ message: 'Reporte enviado exitosamente' });
    } catch (error) {
        console.error('Error al guardar el reporte:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para dejar una sugerencia
router.post('/suggestion', async (req, res) => {
    const { sugerencia } = req.body;

    if (!sugerencia) {
        return res.status(400).json({ error: 'El contenido de la sugerencia es requerido' });
    }

    try {
        const query = "INSERT INTO sugerencia (Sugerencia, Fecha) VALUES (?, NOW())";
        await db.query(query, [sugerencia]);
        res.status(201).json({ message: 'Sugerencia enviada exitosamente' });
    } catch (error) {
        console.error('Error al guardar la sugerencia:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para obtener reportes
router.get('/report', async (req, res) => {
    try {
        const query = "SELECT * FROM reporte ORDER BY Fecha DESC";
        const reports = await db.query(query);
        res.json(reports);
    } catch (error) {
        console.error('Error al obtener reportes:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para obtener sugerencias
router.get('/suggestion', async (req, res) => {
    try {
        const query = "SELECT * FROM sugerencia ORDER BY Fecha DESC";
        const suggestions = await db.query(query);
        res.json(suggestions);
    } catch (error) {
        console.error('Error al obtener sugerencias:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
