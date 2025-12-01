const db = require('./config/database');

async function insertRecipes() {
    try {
        console.log("Insertando recetas faltantes...");

        // Hamburguesa con Queso (ID 2)
        // 1 Pan (7), 0.15 Carne (8), 1 Queso (9)
        await db.query("INSERT INTO receta (IDPlatillo, IDProducto, Cantidad) VALUES (?, ?, ?)", [2, 7, 1]);
        await db.query("INSERT INTO receta (IDPlatillo, IDProducto, Cantidad) VALUES (?, ?, ?)", [2, 8, 0.15]);
        await db.query("INSERT INTO receta (IDPlatillo, IDProducto, Cantidad) VALUES (?, ?, ?)", [2, 9, 1]);

        // Hamburguesa Doble (ID 3)
        // 1 Pan (7), 0.30 Carne (8)
        await db.query("INSERT INTO receta (IDPlatillo, IDProducto, Cantidad) VALUES (?, ?, ?)", [3, 7, 1]);
        await db.query("INSERT INTO receta (IDPlatillo, IDProducto, Cantidad) VALUES (?, ?, ?)", [3, 8, 0.30]);

        console.log("Recetas insertadas correctamente.");
        process.exit(0);
    } catch (error) {
        console.error("Error inserting recipes:", error);
        process.exit(1);
    }
}

insertRecipes();
