import * as bDate from '../controllers/bDateController.js';

/**
 * @param {ExpressApp} app
 * @returns {void}
 */
function routes (app) {
  // API test
  app.route('/test').
    get(bDate.test);
  // Today's Badí' date
  app.route('/today').
    post(bDate.today);
  // Arbitrary Badí' date
  app.route('/date').
    get(bDate.date);

  app.route('/today').
    get(bDate.todayHtml);
}

export default routes;
