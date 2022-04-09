import express from 'express';
import bodyParser from 'body-parser';
import expressRateLimit from 'express-rate-limit';

import routes from './api/routes/bDateRoutes.js'; // importing routes

/**
 * @param {ExpressApp} app
 * @returns {ExpressApp}
 */
function createServer ({
  app = express(),
  rateLimit = {
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20
  }
} = {}) {
  if (rateLimit) {
    app.use(expressRateLimit(rateLimit));
  }

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  routes(app); // register the routes

  return app;
}

export default createServer;
