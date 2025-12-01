const express = require('express');
const router = express.Router();
const db = require('../config/database');

// POST /api/orders - Procesar una orden y descontar stock
router.post("/", async (req, res, next) => {
    try {
        const { items } = req.body; // items: [{ id: IDPlatillo, quantity: number }]

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ code: 400, message: "No hay items en la orden" });
        }

        // Iniciar transacción (si la librería lo soporta, si no, lo hacemos secuencial)
        // Nota: db.query wrapper podría no soportar transacciones explícitas fácilmente sin connection pool access directo.
        // Asumiremos ejecución secuencial por ahora.

        for (const item of items) {
            const { id, quantity } = item;

            // 1. Obtener la receta del platillo
            const recipeQuery = "SELECT IDProducto, Cantidad FROM receta WHERE IDPlatillo = ?";
            const recipeRows = await db.query(recipeQuery, [id]);

            if (recipeRows.length > 0) {
                // 2. Descontar stock de cada ingrediente
                for (const ingredient of recipeRows) {
                    const amountToDeduct = ingredient.Cantidad * quantity;
                    // Usamos StockMinimo como la columna de cantidad según indicación del usuario
                    const updateQuery = "UPDATE producto SET StockMinimo = StockMinimo - ? WHERE IDProducto = ?";
                    await db.query(updateQuery, [amountToDeduct, ingredient.IDProducto]);
                }
            }
        }

        return res.status(201).json({ code: 201, message: "Orden procesada y stock actualizado" });

    } catch (error) {
        console.error("Error processing order:", error);
        return res.status(500).json({ code: 500, message: "Error al procesar la orden" });
    }
});

module.exports = router;
