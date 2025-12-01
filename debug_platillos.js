const db = require('./config/database');

async function checkPlatillos() {
    try {
        const query = "SELECT * FROM platillo";
        const rows = await db.query(query);
        console.log("--- PLATILLOS ---");
        console.table(rows);
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

checkPlatillos();
