const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/orders - Obtener historial de órdenes
router.get("/", async (req, res, next) => {
    try {
        const query = "SELECT * FROM orden ORDER BY Fecha DESC";
        const rows = await db.query(query);
        return res.status(200).json({ code: 200, message: rows });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({ code: 500, message: "Error al obtener las órdenes" });
    }
});

// POST /api/orders - Procesar una orden, guardar en BD y descontar stock
router.post("/", async (req, res, next) => {
    try {
        console.log("Processing new order:", req.body);
        const { items } = req.body; // items: [{ id: IDPlatillo, quantity: number }]

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ code: 400, message: "No hay items en la orden" });
        }

        // 1. Calcular el TOTAL de la orden obteniendo precios de la BD
        let totalOrder = 0;
        const orderDetails = [];

        for (const item of items) {
            const { id, quantity } = item;
            console.log(`Processing item: id=${id}, quantity=${quantity}`);

            // Obtener precio del platillo
            const dishQuery = "SELECT IDPlatillo, Nombre, Precio FROM platillo WHERE IDPlatillo = ?";
            const dishRows = await db.query(dishQuery, [id]);

            if (dishRows.length === 0) {
                console.error(`Dish not found: ${id}`);
                return res.status(404).json({ code: 404, message: `Platillo con ID ${id} no encontrado` });
            }

            const dish = dishRows[0];
            const subtotal = dish.Precio * quantity;
            totalOrder += subtotal;

            orderDetails.push({
                ...dish,
                quantity
            });
        }

        console.log("Total calculated:", totalOrder);

        // 2. Insertar la orden en la tabla 'orden'
        // Asumimos que la tabla 'orden' tiene columnas: IDOrden (AI), Fecha, Total
        // Usamos CURDATE() para asegurar que solo se guarde la fecha actual
        const insertOrderQuery = "INSERT INTO orden (Fecha, Total) VALUES (CURDATE(), ?)";
        console.log("Executing insert order query...");
        const orderResult = await db.query(insertOrderQuery, [totalOrder]);
        console.log("Order inserted, ID:", orderResult.insertId);
        const newOrderId = orderResult.insertId;

        // 3. Descontar stock de los ingredientes (Lógica original mantenida)
        for (const item of items) {
            const { id, quantity } = item;

            // Obtener la receta del platillo
            const recipeQuery = "SELECT IDProducto, Cantidad FROM receta WHERE IDPlatillo = ?";
            const recipeRows = await db.query(recipeQuery, [id]);

            if (recipeRows.length > 0) {
                for (const ingredient of recipeRows) {
                    const amountToDeduct = ingredient.Cantidad * quantity;
                    console.log(`Deducting stock for product ${ingredient.IDProducto}: ${amountToDeduct}`);
                    // Usamos StockMinimo como la columna de cantidad
                    const updateQuery = "UPDATE producto SET StockMinimo = StockMinimo - ? WHERE IDProducto = ?";
                    await db.query(updateQuery, [amountToDeduct, ingredient.IDProducto]);
                }
            }
        }

        console.log("Order processed successfully");
        return res.status(201).json({
            code: 201,
            message: "Orden procesada exitosamente",
            orderId: newOrderId,
            total: totalOrder
        });

    } catch (error) {
        console.error("Error processing order:", error);

        let availableTables = [];
        if (error.errno === 1146) {
            try {
                const tablesResult = await db.query("SHOW TABLES");
                availableTables = tablesResult.map(row => Object.values(row)[0]);
                console.log("Available tables:", availableTables);
            } catch (tableError) {
                console.error("Error fetching tables:", tableError);
            }
        }

        return res.status(500).json({
            code: 500,
            message: "Error al procesar la orden",
            error: error.message,
            sqlMessage: error.sqlMessage || "No SQL message",
            availableTables: availableTables.length > 0 ? availableTables.join(", ") : undefined
        });
    }
});

module.exports = router;
