const db = require('./config/database');

async function checkRecipes() {
    try {
        const query = `
            SELECT r.IDReceta, p.Nombre as Platillo, prod.Nombre as Producto, r.Cantidad
            FROM receta r
            JOIN platillo p ON r.IDPlatillo = p.IDPlatillo
            JOIN producto prod ON r.IDProducto = prod.IDProducto
            ORDER BY p.Nombre;
        `;
        const rows = await db.query(query);
        console.log("--- RECETAS EN BASE DE DATOS ---");
        console.table(rows);
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

checkRecipes();
