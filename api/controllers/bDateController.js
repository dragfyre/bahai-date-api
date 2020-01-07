'use strict';
var BadiCal = require('../../vendor/assets/badi-cal/index.js');

function sanitize_input(s) {
  if (s==''||s===undefined||s===null||s==false||isNaN(s)) { return 0; }
  else { return parseInt(s,10); }
}

exports.test = function(req, res) {
  res.json({ message: 'Hi there' });
};
exports.today = function(req, res) {
  var now = new Date();
  var here = new Object();
  here['latitude'] = '40.712'; // New York
  here['longitude'] = '-74.006';

  var now_badi = BadiCal.BadiDate.fromGregorianDate(now, here);
  res.json({ message: "Today is " + now_badi.toString(),badi_date:{year:now_badi.getYear(),month:now_badi.getMonth(),day:now_badi.getDay(),month_name:now_badi.getMonthName()},greg_date:{year:now.getFullYear(),month:now.getMonth()+1,day:now.getDay(),hour:now.getHours(),minute:now.getMinutes(),second:now.getSeconds()}});
  console.log("Today: " + now_badi.toString());
};
exports.date = function(req, res) {
  var year = sanitize_input(req.query['year']);
  var month = sanitize_input(req.query['month'])-1;
  var day = sanitize_input(req.query['day']);
  var hour = sanitize_input(req.query['hour']);
  var minute = sanitize_input(req.query['minute']);
  var second = sanitize_input(req.query['second']);

  var now = new Date(year,month,day,hour,minute,second);
  var here = new Object();
  here['latitude'] = '40.712'; // New York
  here['longitude'] = '-74.006';

  var now_badi = BadiCal.BadiDate.fromGregorianDate(now, here);
  res.json({ message: "The date is: " + now_badi.toString(),badi_date:{year:now_badi.getYear(),month:now_badi.getMonth(),day:now_badi.getDay(),month_name:now_badi.getMonthName()},greg_date:{year:year,month:month+1,day:day,hour:hour,minute:minute,second:second}});
  console.log("Date: " + now.toString() + " -> " + now_badi.toString());
};
