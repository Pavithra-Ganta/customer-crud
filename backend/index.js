const express = require('express');
const bodyParser = require("body-parser");
const sequelize = require('./db');  
const userRoutes = require('./routes/user-route'); 
var cors=require("cors");

const app = express();
const port = 3000;
const host = '127.0.0.1';
app.use(cors());

app.use(bodyParser.json());

app.use(userRoutes);

app.listen(port, host, () => {
    console.log(`Server started at ${host} on port ${port}`);
});

module.exports = app;