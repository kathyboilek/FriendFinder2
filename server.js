// Import dependencies.
var express = require('express');
var bodyParser = require('body-parser');
var cli = require('cli');

// Initialize app.
var app = express();

// PORT is either the port provided by Heroku via process.env.PORT or 8080.
var PORT = process.env.PORT || 8080;

// Set up middleware.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(express.static(__dirname + '/app/public'));

// Import routes.
require('./app/routing/apiRoutes')(app);
require('./app/routing/htmlRoutes')(app);

// Start listening.
// app.listen(PORT, '0.0.0.0');

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function() {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
  });
  