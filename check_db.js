const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "proyectofinal"
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to DB:", err);
        return;
    }
    console.log("Connected to DB");

    // Check columns for producto
    db.query("SHOW COLUMNS FROM producto", (err, rows) => {
        if (err) console.error("Error showing columns for producto:", err.message);
        else {
            console.log("Columns in producto:");
            rows.forEach(row => console.log(`- ${row.Field} (${row.Type})`));
        }

        // Check columns for platillo
        db.query("SHOW COLUMNS FROM platillo", (err, rows) => {
            if (err) console.error("Error showing columns for platillo:", err.message);
            else {
                console.log("Columns in platillo:");
                rows.forEach(row => console.log(`- ${row.Field} (${row.Type})`));
            }
            db.end();
        });
    });
});
