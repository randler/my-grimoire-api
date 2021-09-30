const express = require('express');
const bodyparser = require('body-parser');

// App
const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

// Load routes
const indexRoutes = require('./routes/index-routes');
app.use('/', indexRoutes);
module.exports = app;