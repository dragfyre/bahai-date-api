/* eslint-disable camelcase -- Current API */
import * as luxon from 'luxon';

import {LocalBadiDate} from 'badidate';

/**
 * @import {DateTime, DateObjectUnits} from 'luxon';
 */

/**
 * @typedef {number} Integer
 */

/**
 * @typedef {number} Float
 */

/**
 * @typedef {object} DateConfig
 * @property {Float} latitude
 * @property {Float} longitude
 * @property {string} timezoneId
 */

/**
 * @param {DateObjectUnits} dte
 * @param {Partial<DateConfig>} dateCfg
 * @returns {[DateTime, LocalBadiDate]}
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
* @param {string|undefined} tz
* @returns {string|undefined}
*/
function sanitizeTimeZone (tz) {
  if (tz === undefined) {
    return undefined;
  }

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
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {void}
 */
function test (req, res) {
  res.json({message: 'Hi there'});
}

/**
* @typedef {object} BadiDateInfo
* @property {string} message
* @property {object} badi_date
* @property {Integer} badi_date.year
* @property {Integer} badi_date.month
* @property {Integer} badi_date.day
* @property {string} badi_date.month_name
* @property {string} badi_date.timezone_id
* @property {object} greg_date
* @property {Integer} greg_date.year
* @property {Integer} greg_date.month
* @property {Integer} greg_date.day
* @property {Integer} greg_date.hour
* @property {Integer} greg_date.minute
* @property {Integer} greg_date.second
* @property {Integer} greg_date.timezoneOffset
*/

/**
* @typedef {object} BadiDateResponse
* @property {DateTime} now
* @property {LocalBadiDate} nowBadi
* @property {BadiDateInfo} json
*/

/**
 * @param {Partial<DateConfig>} dateObj
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
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {void}
 */
function today (req, res) {
  const {json, nowBadi} = getTodayJSON(req.query);
  // eslint-disable-next-line no-console -- CLI
  console.log('Today: ' + nowBadi.badiDate.format());
  res.json(json);
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {void}
 */
function todayHtml (req, res) {
  res.set('content-type', 'text/html;charset=utf-8');
  res.end(JSON.stringify(getTodayJSON(req.query).json, null, 2));
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
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
 * @typedef {Partial<DateConfig> & {
 *   year: Integer,
 *   month: Integer,
 *   day: Integer,
 *   hour: Integer,
 *   minute: Integer,
 *   second: Integer
 * }} FullDateConfig
 */

/**
 * @param {Partial<FullDateConfig>} dateObj
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
