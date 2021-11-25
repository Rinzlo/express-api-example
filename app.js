const express = require("express");
const bodyParser = require('body-parser');
const routes = require('./routes/recipes');

const app = express();
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use('/recipes/', routes);

module.exports = app;