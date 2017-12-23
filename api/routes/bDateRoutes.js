'use strict';
module.exports = function(app) {
  var bDate = require('../controllers/bDateController');

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