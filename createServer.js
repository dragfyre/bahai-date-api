'use strict';

const express = require('express'),
  bodyParser = require('body-parser'),
  RateLimit = require('express-rate-limit');

const routes = require('./api/routes/bDateRoutes.js'); // importing routes

/**
* @returns {ExpressApp}
*/
function createServer () {
  const app = express();

  app.use(new RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20
  }));

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  routes(app); // register the routes

  return app;
}

module.exports = createServer;
