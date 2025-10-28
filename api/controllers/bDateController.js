/* eslint-disable camelcase -- Current API */
import * as luxon from 'luxon';

import {LocalBadiDate} from 'badidate';

/**
 * @typedef {PlainObject} DateConfig
 * @property {string} latitude
 * @property {string} longitude
 * @property {string} timezoneId
 */

/**
 * @param {LuxonDateObject} dte
 * @param {DateConfig} dateCfg
 * @returns {[LuxonDate, LocalBadiDate]}
 */
function createDateObject (dte, {
  // Bahjí
  latitude = 32.9434,
  longitude = 35.0924,
  timezoneId = 'Asia/Jerusalem'
} = {}) {
  const luxonDate = luxon.DateTime.fromObject(dte).setZone(
    timezoneId
  );
  return [
    luxonDate,
    new LocalBadiDate(luxonDate, latitude, longitude, timezoneId)
  ];
}

/**
* @param {string} tz
* @returns {string|undefined}
*/
function sanitizeTimeZone (tz) {
  try {
    const timeZone = tz.replaceAll(' ', '_');
    // eslint-disable-next-line no-new -- Testing
    new Intl.DateTimeFormat(undefined, {timeZone});
    return timeZone;
  } catch (err) {
    // Will allow default above to be used
    return undefined;
  }
}

/* eslint-disable jsdoc/reject-any-type -- Arbitrary */
/**
 * @typedef {any} ArbitraryArgumentToConvert
 */
/* eslint-enable jsdoc/reject-any-type -- Arbitrary */

/**
 * @param {ArbitraryArgumentToConvert} s
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
 * @param {ArbitraryArgumentToConvert} s
 * @returns {Integer}
 */
function sanitizeInteger (s) {
  if (s === '' || s === undefined || s === null || s === false ||
    Number.isNaN(Number(s))) {
    return 0;
  }
  return Number.parseInt(s);
}

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {void}
 */
function test (req, res) {
  res.json({message: 'Hi there'});
}

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
const getTodayJSON = function (dateObj = {}) {
  const latitude = sanitizeFloat(dateObj.latitude);
  const longitude = sanitizeFloat(dateObj.longitude);
  const timezoneId = sanitizeTimeZone(dateObj.timezoneId);

  const [now, nowBadi] = createDateObject({}, {
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
        year: now.year,
        month: now.month,
        day: now.day,
        hour: now.hour,
        minute: now.minute,
        second: now.second,
        timezoneOffset: now.offset
      }
    }
  };
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {void}
 */
function today (req, res) {
  const {json, nowBadi} = getTodayJSON(req.query);
  // eslint-disable-next-line no-console -- CLI
  console.log('Today: ' + nowBadi.badiDate.format());
  res.json(json);
}

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {void}
 */
function todayHtml (req, res) {
  res.set('content-type', 'text/html;charset=utf-8');
  res.end(JSON.stringify(getTodayJSON(req.query).json, null, 2));
}

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {void}
 */
function date (req, res) {
  const dateInfo = getDate(req.query);
  // eslint-disable-next-line no-console -- CLI
  console.log(
    'Date: ' + dateInfo.now.toString() + ' -> ' +
      dateInfo.nowBadi.badiDate.format()
  );
  res.json(dateInfo.json);
}

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
const getDate = function (dateObj) {
  const year = sanitizeInteger(dateObj.year);
  const month = sanitizeInteger(dateObj.month);
  const day = sanitizeInteger(dateObj.day);
  const hour = sanitizeInteger(dateObj.hour);
  const minute = sanitizeInteger(dateObj.minute);
  const second = sanitizeInteger(dateObj.second);

  const latitude = sanitizeFloat(dateObj.latitude);
  const longitude = sanitizeFloat(dateObj.longitude);
  const timezoneId = sanitizeTimeZone(dateObj.timezoneId);

  const [now, nowBadi] = createDateObject({
    year, month, day, hour, minute, second
  }, {
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
        year: now.year,
        month: now.month,
        day: now.day,
        hour: now.hour,
        minute: now.minute,
        second: now.second,
        timezoneOffset: now.offset
      }
    }
  };
};

export {test, getTodayJSON, today, todayHtml, date, getDate};
