'use strict';
const luxon = require('luxon');

const {LocalBadiDate} = require('badidate');

const here = {
  latitude: '40.712',
  longitude: '-74.006',
  timezoneId: 'America/New York'
};

/**
 * @param {Date} date
 * @returns {LocalBadiDate}
 */
function createDateObject (date) {
  const {latitude, longitude, timezoneId} = here;
  const luxonDate = luxon.DateTime.fromJSDate(date);
  return new LocalBadiDate(luxonDate, latitude, longitude, timezoneId);
}

/**
 * @param {any} s
 * @returns {Integer}
 */
function sanitizeInput (s) {
  if (s === '' || s === undefined || s === null || s === false ||
    Number.isNaN(Number(s))) {
    return 0;
  }
  return Number.parseInt(s);
}

exports.test = function (req, res) {
  res.json({message: 'Hi there'});
};

/**
* @typedef {PlainObject} LocalBadiDateObject
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
 * @returns {LocalBadiDateObject}
 */
const getTodayJSON = exports.getTodayJSON = function () {
  const now = new Date();

  const nowBadi = createDateObject(now);

  return {
    now,
    nowBadi,
    json: {
      message: 'Today is ' + nowBadi.badiDate.format(),
      badi_date: {
        year: nowBadi.badiDate.year,
        month: nowBadi.badiDate.month,
        day: nowBadi.badiDate.day,
        month_name: nowBadi.badiDate.format('MM+')
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
  // eslint-disable-next-line no-console -- CLI
  console.log('Today: ' + nowBadi.badiDate.format());
  res.json(json);
};

exports.todayHtml = function (req, res) {
  res.set('content-type', 'text/html;charset=utf-8');
  res.end(JSON.stringify(getTodayJSON().json, null, 2));
};

exports.date = function (req, res) {
  const dateInfo = getDate(req.query);
  // eslint-disable-next-line no-console -- CLI
  console.log(
    'Date: ' + dateInfo.now.toString() + ' -> ' +
      dateInfo.nowBadi.badiDate.format()
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

  const nowBadi = createDateObject(now);
  return {
    now,
    nowBadi,
    json: {
      message: 'The date is: ' + nowBadi.badiDate.format(),
      badi_date: {
        year: nowBadi.badiDate.year,
        month: nowBadi.badiDate.month,
        day: nowBadi.badiDate.day,
        month_name: nowBadi.badiDate.format('MM+')
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
