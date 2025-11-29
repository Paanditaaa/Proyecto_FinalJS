/Dependencies/
const morgan = require('morgan');
const express = require('express');
const app = express();
const db = require('./config/database.js');

/Routers/
const user = require('./routes/user');

/MiddleWare/
const authMiddleware = require('./middleware/auth');
const notFound = require('./middleware/notFound');
const index = require('./middleware/index');
const corsMiddleware = require("./middleware/cors");


app.use(corsMiddleware);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", index);
app.use("/api", user);
app.get("/usuarios", async (req, res) => {
    const usuarios = await db.query("SELECT * FROM datos_empleados");
    res.json(usuarios);
});


app.use(authMiddleware);


app.use(notFound)

app.listen(process.env.PORT || 3001, () => {
    console.log("Server is running...");
});