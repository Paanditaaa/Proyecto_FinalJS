// Dependencies
const morgan = require('morgan');
const express = require('express');
const app = express();
const db = require('./config/database.js');

// Routers
const user = require('./routes/user');
const products = require('./routes/products');
const categories = require('./routes/categories');

// Middleware
const authMiddleware = require('./middleware/auth'); // Middleware de protección
const notFound = require('./middleware/notFound');
const index = require('./middleware/index');
const corsMiddleware = require("./middleware/cors");

app.use(corsMiddleware);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 💡 RUTAS PÚBLICAS (NO REQUIEREN AUTH) ---
app.get("/", index);

// Asumo que el router 'user' CONTIENE LA RUTA DE LOGIN (/api/user/login)
app.use("/api/user", user);
app.use("/api/categories", categories);
app.use("/api/proveedores", require('./routes/proveedores'));
app.use("/api/feedback", require('./routes/feedback'));

// 🛑 AHORA APLICA LA AUTENTICACIÓN A LAS RUTAS PROTEGIDAS
app.use(authMiddleware);

// --- 🔒 RUTAS PRIVADAS (REQUIEREN AUTH) ---
app.use("/api/products", products);
app.use("/api/menu", require('./routes/menu'));
app.use("/api/orders", require('./routes/orders'));

// Esta ruta también requiere Auth si usa datos sensibles
app.get("/usuarios", async (req, res) => {
    const usuarios = await db.query("SELECT * FROM datos_empleados");
    res.json(usuarios);
});

app.use(notFound); // Middleware de 404 siempre al final

app.listen(process.env.PORT || 3002, () => {
    console.log("Server is running...");
});