'use strict';
const bDate = require('../controllers/bDateController');

module.exports = function (app) {
  // API test
  app.route('/test')
    .get(bDate.test);
  // Today's Badí' date
  app.route('/today')
    .post(bDate.today);
  // Arbitrary Badí' date
  app.route('/date')
    .get(bDate.date);

  app.route('/today')
    .get(bDate.todayHtml);
};
