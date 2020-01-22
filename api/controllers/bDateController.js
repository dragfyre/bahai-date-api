'use strict';
const BadiCal = require('../../vendor/assets/badi-cal/index.js');

/**
 * @param {any} s
 * @returns {Integer}
 */
function sanitizeInput (s) {
  if (s === '' || s === undefined || s === null || s === false || isNaN(s)) {
    return 0;
  }
  return parseInt(s);
}

exports.test = function (req, res) {
  res.json({message: 'Hi there'});
};

/**
* @typedef {PlainObject} BadiDateObject
* @property {string} message
* @property {PlainObject} badi_date
* @property {Integer} badi_date.year
* @property {Integer} badi_date.month
* @property {Integer} badi_date.day
* @property {string} badi_date.month_name
* @property {PlainObject} greg_date
* @property {Integer} greg_date.year
* @property {Integer} greg_date.month
* @property {Integer} greg_date.day
* @property {Integer} greg_date.hour
* @property {Integer} greg_date.minute
* @property {Integer} greg_date.second
*/

/**
 * @returns {BadiDateObject}
 */
function getTodayJSON () {
  const now = new Date();
  const here = {
    latitude: '40.712', // New York
    longitude: '-74.006'
  };

  const nowBadi = BadiCal.BadiDate.fromGregorianDate(now, here);

  // eslint-disable-next-line no-console
  console.log('Today: ' + nowBadi.toString());
  return {
    message: 'Today is ' + nowBadi.toString(),
    badi_date: {
      year: nowBadi.getYear(),
      month: nowBadi.getMonth(),
      day: nowBadi.getDay(),
      month_name: nowBadi.getMonthName()
    },
    greg_date: {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDay(),
      hour: now.getHours(),
      minute: now.getMinutes(),
      second: now.getSeconds()
    }
  };
}

exports.today = function (req, res) {
  res.json(getTodayJSON());
};

exports.todayHtml = function (req, res) {
  res.end(JSON.stringify(getTodayJSON(), null, 2));
};

exports.date = function (req, res) {
  const year = sanitizeInput(req.query.year);
  const month = sanitizeInput(req.query.month) - 1;
  const day = sanitizeInput(req.query.day);
  const hour = sanitizeInput(req.query.hour);
  const minute = sanitizeInput(req.query.minute);
  const second = sanitizeInput(req.query.second);

  const now = new Date(year, month, day, hour, minute, second);
  const here = {
    latitude: '40.712', // New York
    longitude: '-74.006'
  };

  const nowBadi = BadiCal.BadiDate.fromGregorianDate(now, here);
  res.json({
    message: 'The date is: ' + nowBadi.toString(),
    badi_date: {
      year: nowBadi.getYear(),
      month: nowBadi.getMonth(),
      day: nowBadi.getDay(),
      month_name: nowBadi.getMonthName()
    },
    greg_date: {
      year,
      month: month + 1,
      day,
      hour,
      minute,
      second
    }
  });

  // eslint-disable-next-line no-console
  console.log('Date: ' + now.toString() + ' -> ' + nowBadi.toString());
};
