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
const getTodayJSON = exports.getTodayJSON = function () {
  const now = new Date();
  const here = {
    latitude: '40.712', // New York
    longitude: '-74.006'
  };

  const nowBadi = BadiCal.BadiDate.fromGregorianDate(now, here);

  return {
    now,
    nowBadi,
    json: {
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
        day: now.getDate(),
        hour: now.getHours(),
        minute: now.getMinutes(),
        second: now.getSeconds()
      }
    }
  };
};

exports.today = function (req, res) {
  const {json, nowBadi} = getTodayJSON();
  // eslint-disable-next-line no-console
  console.log('Today: ' + nowBadi.toString());
  res.json(json);
};

exports.todayHtml = function (req, res) {
  res.end(JSON.stringify(getTodayJSON().json, null, 2));
};

exports.date = function (req, res) {
  const dateInfo = getDate(req.query);
  // eslint-disable-next-line no-console
  console.log(
    'Date: ' + dateInfo.now.toString() + ' -> ' + dateInfo.nowBadi.toString()
  );
  res.json(dateInfo.json);
};

const getDate = exports.getDate = function (dateObj) {
  const year = sanitizeInput(dateObj.year);
  const month = sanitizeInput(dateObj.month) - 1;
  const day = sanitizeInput(dateObj.day);
  const hour = sanitizeInput(dateObj.hour);
  const minute = sanitizeInput(dateObj.minute);
  const second = sanitizeInput(dateObj.second);

  const now = new Date(year, month, day, hour, minute, second);
  const here = {
    latitude: '40.712', // New York
    longitude: '-74.006'
  };

  const nowBadi = BadiCal.BadiDate.fromGregorianDate(now, here);
  return {
    now,
    nowBadi,
    json: {
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
    }
  };
};
