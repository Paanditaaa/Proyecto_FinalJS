const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/proveedores - Obtener todos los proveedores
router.get("/", async (req, res, next) => {
    try {
        const query = "SELECT * FROM proveedor";
        const rows = await db.query(query);
        return res.status(200).json({ code: 200, message: rows });
    } catch (error) {
        console.error("Error fetching proveedores:", error);
        return res.status(500).json({ code: 500, message: "Error al obtener proveedores" });
    }
});

// POST /api/proveedores - Crear un nuevo proveedor
router.post("/", async (req, res, next) => {
    try {
        const { Nombre, Telefono, Correo } = req.body;

        // Validación básica
        if (!Nombre || !Correo) {
            return res.status(400).json({ code: 400, message: "Nombre y Correo son obligatorios" });
        }

        const query = "INSERT INTO proveedor (Nombre, Telefono, Correo) VALUES (?, ?, ?)";
        const result = await db.query(query, [Nombre, Telefono || null, Correo]);

        if (result.affectedRows > 0) {
            return res.status(201).json({
                code: 201,
                message: "Proveedor creado correctamente",
                id: result.insertId
            });
        }
        return res.status(500).json({ code: 500, message: "No se pudo crear el proveedor" });

    } catch (error) {
        console.error("Error creating proveedor:", error);
        return res.status(500).json({ code: 500, message: "Error al crear proveedor" });
    }
});

// PUT /api/proveedores/:id - Actualizar un proveedor
router.put("/:id", async (req, res, next) => {
    try {
        const { Nombre, Telefono, Correo } = req.body;
        const query = "UPDATE proveedor SET Nombre = ?, Telefono = ?, Correo = ? WHERE IDProveedor = ?";
        const result = await db.query(query, [Nombre, Telefono, Correo, req.params.id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({ code: 200, message: "Proveedor actualizado correctamente" });
        }
        return res.status(404).json({ code: 404, message: "Proveedor no encontrado" });
    } catch (error) {
        console.error("Error updating proveedor:", error);
        return res.status(500).json({ code: 500, message: "Error al actualizar proveedor" });
    }
});

// DELETE /api/proveedores/:id - Eliminar un proveedor
router.delete("/:id", async (req, res, next) => {
    try {
        const query = "DELETE FROM proveedor WHERE IDProveedor = ?";
        const result = await db.query(query, [req.params.id]);
        if (result.affectedRows > 0) {
            return res.status(200).json({ code: 200, message: "Proveedor eliminado correctamente" });
        }
        return res.status(404).json({ code: 404, message: "Proveedor no encontrado" });
    } catch (error) {
        console.error("Error deleting proveedor:", error);
        return res.status(500).json({ code: 500, message: "Error al eliminar proveedor" });
    }
});

module.exports = router;
