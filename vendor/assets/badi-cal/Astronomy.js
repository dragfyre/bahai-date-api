'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.incrementGregorianDays = incrementGregorianDays;
exports.getUTCDateForTwinBirthdaysOnYear = getUTCDateForTwinBirthdaysOnYear;
exports.getUTCDateForSunsetOnDate = getUTCDateForSunsetOnDate;
exports.getUTCDateForNextNewMoonFromDate = getUTCDateForNextNewMoonFromDate;
exports.getUTCDateForNawRuzOnYear = getUTCDateForNawRuzOnYear;

var _blueyonder = require('./extern/blueyonder');

var _blueyonder2 = _interopRequireDefault(_blueyonder);

var _LocationMap = require('./LocationMap');

var _LocationMap2 = _interopRequireDefault(_LocationMap);

var _stellafane = require('./extern/stellafane');

var _stellafane2 = _interopRequireDefault(_stellafane);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MillisPerDay = 1000 * 60 * 60 * 24;

/**
 * Increment a gregorian date by the number of days specified.
 */
function incrementGregorianDays(gregorianDate, days) {
  return new Date(gregorianDate.getTime() + days * MillisPerDay);
}

/**
 * Finds the time (sunset in Tehran) that twin birthdays start. Twin birthdays
 * occur at Sunset in tehran 8 new moons after Naw Ruz.
 */
function getUTCDateForTwinBirthdaysOnYear(gregorianYear) {
  var gregorianNawRuz = getUTCDateForNawRuzOnYear(gregorianYear);

  var UTCNewMoons = getUTCDateForSunsetOnDate(gregorianNawRuz, _LocationMap2.default.Tehran);
  for (var i = 0; i < 8; ++i) {
    UTCNewMoons = getUTCDateForNextNewMoonFromDate(UTCNewMoons);
  }

  var UTCSunset = getUTCDateForSunsetOnDate(UTCNewMoons, _LocationMap2.default.Tehran);
  if (UTCNewMoons < UTCSunset) {
    UTCNewMoons = incrementGregorianDays(UTCNewMoons, 1);
  } else {
    UTCNewMoons = incrementGregorianDays(UTCNewMoons, 2);
  }

  UTCNewMoons = getUTCDateForSunsetOnDate(UTCNewMoons, _LocationMap2.default.Tehran);
  return new Date(Date.UTC(UTCNewMoons.getUTCFullYear(), UTCNewMoons.getUTCMonth(), UTCNewMoons.getUTCDate()));
}

function getUTCDateForSunsetOnDate(gregorianDate, place) {

  var sunsetTime = _blueyonder2.default.SunRiseSet(gregorianDate.getUTCFullYear(), gregorianDate.getUTCMonth() + 1, gregorianDate.getUTCDate(), place.latitude, place.longitude)[1];

  var sunsetHours = Math.floor(sunsetTime);
  var sunsetMinutes = Math.floor((sunsetTime - sunsetHours) * 60);
  var sunsetSeconds = Math.floor(((sunsetTime - sunsetHours) * 60 - sunsetMinutes) * 60);

  return new Date(Date.UTC(gregorianDate.getUTCFullYear(), gregorianDate.getUTCMonth(), gregorianDate.getUTCDate(), sunsetHours, sunsetMinutes, sunsetSeconds));
}

/**
 * Takes a date and returns the date of the next new moon. This function is
 * recursive.  A client should call this function with two identical parameters.
 *
 * The detailed contract is this: find the first new moon during or after the
 * lunar cycle containing 'date' but occurring after the time 'min'.
 */
function getUTCDateForNextNewMoonFromDate(UTCDate) {
  return recurse(UTCDate, UTCDate);
}

function recurse(UTCDate, minUTCDate) {
  var quarters = _blueyonder2.default.MoonQuarters(UTCDate.getUTCFullYear(), UTCDate.getUTCMonth() + 1, // Month 0-based to 1-based indexing
  UTCDate.getUTCDate(), 0);
  var newMoonDateComponents = _blueyonder2.default.jdtocd(quarters[0]);
  var UTCNewMoon = new Date(Date.UTC(newMoonDateComponents[0], // Year
  newMoonDateComponents[1] - 1, // Month: 1-based to 0-based indexing
  newMoonDateComponents[2], // Day
  newMoonDateComponents[4], // Hour
  newMoonDateComponents[5], // Minute
  newMoonDateComponents[6]));

  if (UTCNewMoon > minUTCDate) {
    return UTCNewMoon;
  }
  return recurse(incrementGregorianDays(minUTCDate, 30), minUTCDate);
}

/**
 * Gets the day of Naw Ruz in a given gregorian year.  It returns the day at
 * 00:00:00 UTC.
 */
function getUTCDateForNawRuzOnYear(gregorianYear) {

  // Step 0: Follow to the UHJ
  // In 2026, the equinox is less than a minute from sunset. The
  // algorithms from Meeus which we're using don't give accuraccy
  // better than one minute, and don't give us the right answer. The
  // UHJ has said that Naw Ruz this day is on the 21st.
  if (gregorianYear == 2026) {
    return new Date(Date.UTC(2026, 2, 21));
  }

  // Step 1: find UTC time of the equinox
  var UTCEquinox = _stellafane2.default.vernal_equinox(gregorianYear);

  // Step 2: Find Tehran's sunset on the day of the equinox
  var UTCSunset = getUTCDateForSunsetOnDate(UTCEquinox, _LocationMap2.default.Tehran);

  // Step 3: Find the final day.
  if (UTCEquinox < UTCSunset) {
    return new Date(Date.UTC(UTCEquinox.getUTCFullYear(), UTCEquinox.getUTCMonth(), UTCEquinox.getUTCDate()));
  }
  return new Date(Date.UTC(UTCEquinox.getUTCFullYear(), UTCEquinox.getUTCMonth(),
  // NOTE: Date class handles the case where the day spills to the
  // next month.
  UTCEquinox.getUTCDate() + 1));
}