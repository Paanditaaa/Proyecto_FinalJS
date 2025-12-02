const db = require('./config/database');

async function testQuery() {
    try {
        console.log("Testing query using config/database.js...");
        const rows = await db.query("SELECT * FROM producto");
        console.log("Query successful. Rows:", rows.length);
        process.exit(0);
    } catch (error) {
        console.error("Query failed:", error);
        process.exit(1);
    }
}

testQuery();
