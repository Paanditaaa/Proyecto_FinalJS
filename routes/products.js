const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/products - Obtener todos los productos
router.get("/", async (req, res, next) => {
    try {
        const query = "SELECT * FROM producto";
        const rows = await db.query(query);
        return res.status(200).json({ code: 200, message: rows });
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({ code: 500, message: "Error al obtener productos" });
    }
});

// DELETE /api/products/:id - Eliminar un producto
router.delete("/:id", async (req, res, next) => {
    try {
        const query = "DELETE FROM producto WHERE IDProducto = ?";
        const result = await db.query(query, [req.params.id]);
        if (result.affectedRows > 0) {
            return res.status(200).json({ code: 200, message: "Producto eliminado correctamente" });
        }
        return res.status(404).json({ code: 404, message: "Producto no encontrado" });
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({ code: 500, message: "Error al eliminar producto" });
    }
});

// PUT /api/products/:id - Actualizar un producto (Soporta StockMinimo y actualizaciones parciales)
router.put("/:id", async (req, res, next) => {
    try {
        const updates = req.body;
        const productId = req.params.id;

        // 1. Construir dinámicamente la consulta SET
        const setClauses = [];
        const values = [];

        // Campos permitidos para la actualización
        const allowedFields = ['Nombre', 'UnidadMedida', 'IDCategoria', 'StockMinimo'];

        // Itera sobre los campos permitidos y construye la consulta
        for (const field of allowedFields) {
            if (updates.hasOwnProperty(field)) {
                setClauses.push(`${field} = ?`);
                values.push(updates[field]);
            }
        }

        // Si no se envió ningún campo válido para actualizar, devuelve un error.
        if (setClauses.length === 0) {
            return res.status(400).json({ code: 400, message: "No se proporcionaron campos válidos para actualizar" });
        }

        // 2. Finaliza la construcción de la consulta
        const query = `UPDATE producto SET ${setClauses.join(', ')} WHERE IDProducto = ?`;

        // 3. Añade el ID del producto al final del array de valores
        values.push(productId);

        // 4. Ejecuta la consulta
        const result = await db.query(query, values);

        if (result.affectedRows > 0) {
            return res.status(200).json({ code: 200, message: "Producto actualizado correctamente" });
        }
        return res.status(404).json({ code: 404, message: "Producto no encontrado o sin cambios" });
    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({ code: 500, message: "Error al actualizar producto" });
    }
});

// POST /api/products - Crear un nuevo producto
router.post("/", async (req, res, next) => {
    try {
        const { Nombre, IDCategoria, StockMinimo, UnidadMedida } = req.body;

        // Validación básica
        if (!Nombre || !IDCategoria || !UnidadMedida) {
            return res.status(400).json({ code: 400, message: "Faltan campos obligatorios" });
        }

        const query = "INSERT INTO producto (Nombre, IDCategoria, StockMinimo, UnidadMedida) VALUES (?, ?, ?, ?)";
        const result = await db.query(query, [Nombre, IDCategoria, StockMinimo || 0, UnidadMedida]);

        if (result.affectedRows > 0) {
            return res.status(201).json({ code: 201, message: "Producto creado correctamente" });
        }
        return res.status(500).json({ code: 500, message: "No se pudo crear el producto" });

    } catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({ code: 500, message: "Error al crear producto" });
    }
});

module.exports = router;