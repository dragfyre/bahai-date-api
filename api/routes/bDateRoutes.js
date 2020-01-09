'use strict';
var bDate = require('../controllers/bDateController');

module.exports = function(app) {
  // API test
  app.route('/test')
    .get(bDate.test);
  // Today's Badi date
  app.route('/today')
    .get(bDate.today);
  // Arbitrary Badi date
  app.route('/date')
    .post(bDate.date);
};
