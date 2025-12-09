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

// GET /api/orders/:id - Obtener detalles de una orden específica con sus productos
router.get("/:id", async (req, res, next) => {
    try {
        const orderId = req.params.id;
        console.log(`Fetching details for order ID: ${orderId}`);

        // 1. Obtener información básica de la orden
        const orderQuery = "SELECT IDOrden, Fecha, Total FROM orden WHERE IDOrden = ?";
        const orderRows = await db.query(orderQuery, [orderId]);

        if (orderRows.length === 0) {
            return res.status(404).json({
                code: 404,
                message: "Orden no encontrada"
            });
        }

        const order = orderRows[0];

        // 2. Obtener los productos/platillos de la orden desde la tabla 'pedido'
        // Asumiendo que existe una tabla 'pedido' con: IDPedido, IDOrden, IDPlatillo, Cantidad, PrecioIndividual
        const detailsQuery = `
            SELECT 
                p.IDPlatillo,
                p.Nombre AS Producto,
                ped.Cantidad,
                ped.PrecioIndividual
            FROM pedido ped
            INNER JOIN platillo p ON ped.IDPlatillo = p.IDPlatillo
            WHERE ped.IDOrden = ?
            ORDER BY p.Nombre
        `;

        const detailsRows = await db.query(detailsQuery, [orderId]);

        // 3. Formatear la respuesta
        const response = {
            IDOrden: `#${order.IDOrden.toString().padStart(6, '0')}`,
            Fecha: order.Fecha,
            Total: order.Total,
            Detalles: detailsRows.map(row => ({
                Producto: row.Producto,
                Cantidad: row.Cantidad,
                PrecioIndividual: parseFloat(row.PrecioIndividual)
            }))
        };

        console.log("Order details retrieved successfully:", response);
        return res.status(200).json({
            code: 200,
            message: response
        });

    } catch (error) {
        console.error("Error fetching order details:", error);
        return res.status(500).json({
            code: 500,
            message: "Error al obtener los detalles de la orden",
            error: error.message
        });
    }
});

// DELETE /api/orders/:id - Eliminar una orden específica
router.delete("/:id", async (req, res, next) => {
    try {
        const orderId = req.params.id;
        console.log(`Deleting order ID: ${orderId}`);

        // Verificar que la orden existe
        const checkQuery = "SELECT IDOrden FROM orden WHERE IDOrden = ?";
        const checkRows = await db.query(checkQuery, [orderId]);

        if (checkRows.length === 0) {
            return res.status(404).json({
                code: 404,
                message: "Orden no encontrada"
            });
        }

        // Eliminar la orden (los detalles en 'pedido' se eliminan automáticamente por CASCADE)
        const deleteQuery = "DELETE FROM orden WHERE IDOrden = ?";
        await db.query(deleteQuery, [orderId]);

        console.log(`Order ${orderId} deleted successfully`);
        return res.status(200).json({
            code: 200,
            message: "Orden eliminada exitosamente"
        });

    } catch (error) {
        console.error("Error deleting order:", error);
        return res.status(500).json({
            code: 500,
            message: "Error al eliminar la orden",
            error: error.message
        });
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

        // 2.5. Insertar los detalles de cada producto en la tabla 'pedido'
        // Asumiendo que la tabla 'pedido' tiene: IDPedido (AI), IDOrden, IDPlatillo, Cantidad, PrecioIndividual
        for (const detail of orderDetails) {
            const insertDetailQuery = `
                INSERT INTO pedido (IDOrden, IDPlatillo, Cantidad, PrecioIndividual) 
                VALUES (?, ?, ?, ?)
            `;
            await db.query(insertDetailQuery, [
                newOrderId,
                detail.IDPlatillo,
                detail.quantity,
                detail.Precio
            ]);
            console.log(`Inserted order detail for dish ${detail.IDPlatillo}`);
        }

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
