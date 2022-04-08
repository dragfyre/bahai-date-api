import express from 'express';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';

import routes from './api/routes/bDateRoutes.js'; // importing routes

/**
 * @param {ExpressApp} app
 * @returns {ExpressApp}
 */
function createServer (app = express()) {
  app.use(rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20
  }));

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  routes(app); // register the routes

  return app;
}

export default createServer;
