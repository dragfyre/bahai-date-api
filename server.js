var express = require('express'),
  app = express(),
  port = process.env.PORT || 1844,
  bodyParser = require('body-parser'),
  RateLimit = require('express-rate-limit');

app.use(new RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/bDateRoutes'); //importing route
routes(app); //register the route

app.listen(port);

console.log('Baha\'i Date RESTful API server started: Port ' + port);
