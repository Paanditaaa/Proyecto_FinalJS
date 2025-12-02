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

// POST /api/menu - Crear un nuevo platillo con su receta
router.post("/", async (req, res, next) => {
    try {
        const { Nombre, Precio, ingredients } = req.body;

        // Validación básica
        if (!Nombre || !Precio) {
            return res.status(400).json({ code: 400, message: "Nombre y Precio son obligatorios" });
        }

        if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
            return res.status(400).json({ code: 400, message: "Debe incluir al menos un ingrediente" });
        }

        // 1. Insertar el platillo
        const insertDishQuery = "INSERT INTO platillo (Nombre, Precio) VALUES (?, ?)";
        const dishResult = await db.query(insertDishQuery, [Nombre, Precio]);
        const newDishId = dishResult.insertId;

        // 2. Insertar los ingredientes en la tabla receta
        for (const ingredient of ingredients) {
            const { IDProducto, Cantidad } = ingredient;
            if (!IDProducto || !Cantidad) {
                continue; // Skip invalid ingredients
            }
            const insertRecipeQuery = "INSERT INTO receta (IDPlatillo, IDProducto, Cantidad) VALUES (?, ?, ?)";
            await db.query(insertRecipeQuery, [newDishId, IDProducto, Cantidad]);
        }

        return res.status(201).json({
            code: 201,
            message: "Platillo creado correctamente",
            dishId: newDishId
        });

    } catch (error) {
        console.error("Error creating dish:", error);
        return res.status(500).json({ code: 500, message: "Error al crear el platillo" });
    }
});

// DELETE /api/menu/:id - Eliminar un platillo y su receta
router.delete("/:id", async (req, res, next) => {
    try {
        const dishId = req.params.id;

        // 1. Primero eliminar las recetas (foreign key constraint)
        const deleteRecipeQuery = "DELETE FROM receta WHERE IDPlatillo = ?";
        await db.query(deleteRecipeQuery, [dishId]);

        // 2. Luego eliminar el platillo
        const deleteDishQuery = "DELETE FROM platillo WHERE IDPlatillo = ?";
        const result = await db.query(deleteDishQuery, [dishId]);

        if (result.affectedRows > 0) {
            return res.status(200).json({ code: 200, message: "Platillo eliminado correctamente" });
        }
        return res.status(404).json({ code: 404, message: "Platillo no encontrado" });

    } catch (error) {
        console.error("Error deleting dish:", error);
        return res.status(500).json({ code: 500, message: "Error al eliminar el platillo" });
    }
});

module.exports = router;
