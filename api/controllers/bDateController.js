'use strict';
const luxon = require('luxon');

const {LocalBadiDate} = require('badidate');

/**
 * @typedef {PlainObject} DateConfig
 * @property {string} latitude
 * @property {string} longitude
 * @property {string} timezoneId
 */

/**
 * @param {Date} date
 * @param {DateConfig} dateCfg
 * @returns {LocalBadiDate}
 */
function createDateObject (date, {
  // Bahjí
  latitude = 32.9434,
  longitude = 35.0924,
  timezoneId = 'Asia/Jerusalem'
} = {}) {
  const luxonDate = luxon.DateTime.fromJSDate(date);
  return new LocalBadiDate(luxonDate, latitude, longitude, timezoneId);
}

/**
* @param {string} tz
* @returns {string|undefined}
*/
function sanitizeTimeZone (tz) {
  try {
    const timeZone = tz.replace(/ /gu, '_');
    Intl.DateTimeFormat(undefined, {timeZone});
    return timeZone;
  } catch (err) {
    // Will allow default above to be used
    return undefined;
  }
}

/**
 * @param {any} s
 * @returns {Float|undefined}
 */
function sanitizeFloat (s) {
  if (s === '' || s === undefined || s === null || s === false ||
    Number.isNaN(Number(s))) {
    // Will allow default above to be used
    return undefined;
  }
  return Number.parseFloat(s);
}

/**
 * @param {any} s
 * @returns {Integer}
 */
function sanitizeInteger (s) {
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
* @typedef {PlainObject} BadiDateInfo
* @property {string} message
* @property {PlainObject} badi_date
* @property {Integer} badi_date.year
* @property {Integer} badi_date.month
* @property {Integer} badi_date.day
* @property {string} badi_date.month_name
* @property {string} badi_date.timezone_id
* @property {PlainObject} greg_date
* @property {Integer} greg_date.year
* @property {Integer} greg_date.month
* @property {Integer} greg_date.day
* @property {Integer} greg_date.hour
* @property {Integer} greg_date.minute
* @property {Integer} greg_date.second
* @property {Integer} greg_date.timezoneOffset
*/

/**
* @typedef {PlainObject} BadiDateResponse
* @property {Date} now
* @property {LocalBadiDate} nowBadi
* @property {BadiDateInfo} json
*/

/**
 * @param {DateConfig} dateObj
 * @returns {BadiDateResponse}
 */
const getTodayJSON = exports.getTodayJSON = function (dateObj = {}) {
  const now = new Date();

  const latitude = sanitizeFloat(dateObj.latitude);
  const longitude = sanitizeFloat(dateObj.longitude);
  const timezoneId = sanitizeTimeZone(dateObj.timezoneId);

  const nowBadi = createDateObject(now, {
    latitude, longitude, timezoneId
  });

  return {
    now,
    nowBadi,
    json: {
      message: 'Today is ' + nowBadi.badiDate.format(),
      badi_date: {
        year: nowBadi.badiDate.year,
        month: nowBadi.badiDate.month,
        day: nowBadi.badiDate.day,
        month_name: nowBadi.badiDate.format('MM+'),
        timezone_id: nowBadi.timezoneId
      },
      greg_date: {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
        hour: now.getHours(),
        minute: now.getMinutes(),
        second: now.getSeconds(),
        timezoneOffset: now.getTimezoneOffset()
      }
    }
  };
};

exports.today = function (req, res) {
  const {json, nowBadi} = getTodayJSON(req.query);
  // eslint-disable-next-line no-console -- CLI
  console.log('Today: ' + nowBadi.badiDate.format());
  res.json(json);
};

exports.todayHtml = function (req, res) {
  res.set('content-type', 'text/html;charset=utf-8');
  res.end(JSON.stringify(getTodayJSON(req.query).json, null, 2));
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

/**
* @typedef {DateConfig} FullDateConfig
* @property {Integer} year
* @property {Integer} month
* @property {Integer} day
* @property {Integer} hour
* @property {Integer} minute
* @property {Integer} second
*/

/**
 * @param {FullDateConfig} dateObj
 * @returns {BadiDateResponse}
 */
const getDate = exports.getDate = function (dateObj) {
  const year = sanitizeInteger(dateObj.year);
  const month = sanitizeInteger(dateObj.month) - 1;
  const day = sanitizeInteger(dateObj.day);
  const hour = sanitizeInteger(dateObj.hour);
  const minute = sanitizeInteger(dateObj.minute);
  const second = sanitizeInteger(dateObj.second);

  const now = new Date(year, month, day, hour, minute, second);

  const latitude = sanitizeFloat(dateObj.latitude);
  const longitude = sanitizeFloat(dateObj.longitude);
  const timezoneId = sanitizeTimeZone(dateObj.timezoneId);

  const nowBadi = createDateObject(now, {
    latitude, longitude, timezoneId
  });

  return {
    now,
    nowBadi,
    json: {
      message: 'The date is: ' + nowBadi.badiDate.format(),
      badi_date: {
        year: nowBadi.badiDate.year,
        month: nowBadi.badiDate.month,
        day: nowBadi.badiDate.day,
        month_name: nowBadi.badiDate.format('MM+'),
        timezone_id: nowBadi.timezoneId
      },
      greg_date: {
        year,
        month: month + 1,
        day,
        hour,
        minute,
        second,
        timezoneOffset: now.getTimezoneOffset()
      }
    }
  };
};
