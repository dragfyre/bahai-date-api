'use strict';

const express = require('express'),
  bodyParser = require('body-parser'),
  RateLimit = require('express-rate-limit');

const routes = require('./api/routes/bDateRoutes.js'); // importing route

const app = express(),
  port = process.argv[2] || 1844;

app.use(new RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20
}));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

routes(app); // register the route

app.listen(port);

// eslint-disable-next-line no-console -- CLI
console.log('Baha\'i Date RESTful API server started: Port ' + port);
