/Dependencies/
const morgan = require('morgan');
const express = require('express');
const app = express();

/Routers/
const user = require('./routes/user');

/MiddleWare/
const auth = require('./middleware/auth');
const notFound = require('./middleware/notFound');
const index = require('./middleware/index');
const cors =require('./middleware/cors');

app.use(cors);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", index);

app.use("/user", user);

app.use(auth);


app.use(notFound)

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running...");
});