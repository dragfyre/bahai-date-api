'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Astronomy = require('./Astronomy');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MillisPerHour = 1000 * 60 * 60;
var MillisPerDay = MillisPerHour * 24;

/**
 * Construct a date on the Badi Calendar.  Objects of this class just have a
 * 'year', 'month' and 'day' field, along with some helper functions and extra
 * data (e.g. names of the months)
 */

var BadiDate = function () {
  _createClass(BadiDate, null, [{
    key: 'badiFromGregorianYear',
    value: function badiFromGregorianYear(year) {
      return year - 1844 + 1;
    }
  }, {
    key: 'gregorianFromBadiYear',
    value: function gregorianFromBadiYear(year) {
      return year - 1 + 1844;
    }

    /**
     * Takes a Date and location and returns a BadiDate. badi_to_gregorian on the
     * returned value should produce an identical date object.
     */

  }, {
    key: 'fromGregorianDate',
    value: function fromGregorianDate(gregorianDate, place) {
      // TODO: THIS LOGIC SHOULD GET MOVED TO NORMALIZE METHOD!!!

      var gregorianYear = gregorianDate.getUTCFullYear();
      var gregorianNawRuz = (0, _Astronomy.getUTCDateForNawRuzOnYear)(gregorianYear);
      if (gregorianDate < gregorianNawRuz) {
        gregorianYear -= 1;
        gregorianNawRuz = (0, _Astronomy.getUTCDateForNawRuzOnYear)(gregorianYear);
      }
      var badiYear = BadiDate.badiFromGregorianYear(gregorianYear);

      var daysSinceNawRuz = Math.floor((gregorianDate - gregorianNawRuz) / MillisPerDay);
      var hoursAfterSunset = 0;

      // Count the days past Naw Ruz (@ 00:00:00 UTC) it is. If the sun
      // has already set on this day, we need to add one more day.
      if ((0, _Astronomy.getUTCDateForSunsetOnDate)(gregorianDate, place) < gregorianDate) {
        daysSinceNawRuz += 1;
        var gregorianSunset = (0, _Astronomy.getUTCDateForSunsetOnDate)(gregorianDate, place);
        hoursAfterSunset = (gregorianDate - gregorianSunset) / MillisPerHour;
      } else {
        var previousGregorianDate = new Date(gregorianDate.getTime() - MillisPerDay);
        var _gregorianSunset = (0, _Astronomy.getUTCDateForSunsetOnDate)(previousGregorianDate, place);
        hoursAfterSunset = (gregorianDate - _gregorianSunset) / MillisPerHour;
      }
      var month = Math.floor(daysSinceNawRuz / 19);

      if (month > 19) {
        throw Error('Corrupt date');
      }

      if (month < 18) {
        var day = daysSinceNawRuz % 19 + 1;
        return new BadiDate(badiYear, month, day, hoursAfterSunset, place);
      }

      // month === 18 || month === 19
      var daysAfterMulk = daysSinceNawRuz - 18 * 19;
      var nextGregorianNawRuz = (0, _Astronomy.getUTCDateForNawRuzOnYear)(gregorianYear + 1);
      var daysInYear = (nextGregorianNawRuz - gregorianNawRuz) / MillisPerDay;
      var interclaryDays = daysInYear - 19 * 19;
      // Check if we are in ayyam-i-ha.
      if (daysAfterMulk < interclaryDays) {
        return new BadiDate(badiYear, 18, daysAfterMulk + 1, hoursAfterSunset, place);
      } else {
        return new BadiDate(badiYear, 19, daysAfterMulk + 1 - interclaryDays, hoursAfterSunset, place);
      }
    }
  }]);

  function BadiDate(year, month, day, hoursAfterSunset, place) {
    _classCallCheck(this, BadiDate);

    this._year = year;
    this._month = month;
    this._day = day;
    this._hoursAfterSunset = hoursAfterSunset;
    this._place = place;
  }

  _createClass(BadiDate, [{
    key: 'getYear',
    value: function getYear() {
      return this._year;
    }
  }, {
    key: 'getMonthName',
    value: function getMonthName() {
      return MonthNames[this._month];
    }
  }, {
    key: 'getMonth',
    value: function getMonth() {
      return this._month;
    }
  }, {
    key: 'getDay',
    value: function getDay() {
      return this._day;
    }
  }, {
    key: 'getHoursAfterSunset',
    value: function getHoursAfterSunset() {
      return this._hoursAfterSunset;
    }
  }, {
    key: 'getPlace',
    value: function getPlace() {
      return this._place;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this._day + ' ' + this.getMonthName() + ' ' + this._year;
    }
  }, {
    key: 'compare',
    value: function compare(other) {
      return (this._year - other._year) * 400 + (this._month - other._month) * 19 + (this._day - other._day);
    }
  }, {
    key: 'equals',
    value: function equals(other) {
      return this.compare(other) === 0;
    }

    /**
     * Returns a Date Object (which includes the time). Note that BadiDates
     * contain a latitude/longitude, and this latitude/longitude is used to
     * determine the corresponding UTC time.
     */

  }, {
    key: 'toGregorianDate',
    value: function toGregorianDate() {
      if (this.getMonth() > 19) {
        throw Error('Corrupt state in BadiDate.getMonth()');
      }

      // Month 18 is Interclary Days, this is a special case.
      if (this.getMonth() < 19) {
        var gregorianYear = BadiDate.gregorianFromBadiYear(this.getYear());
        var gregorianNawRuz = (0, _Astronomy.getUTCDateForNawRuzOnYear)(gregorianYear);
        var _daysToAdd = this.getMonth() * 19 + this.getDay() - 2;
        var _gregorianStartOfDay = (0, _Astronomy.incrementGregorianDays)(gregorianNawRuz, _daysToAdd);
        var _gregorianSunset2 = (0, _Astronomy.getUTCDateForSunsetOnDate)(_gregorianStartOfDay, this.getPlace());
        return (0, _Astronomy.incrementGregorianDays)(_gregorianSunset2, this.getHoursAfterSunset() / 24);
      }

      // this.getMonth() === 19
      var gregorianEnd = BadiDate.gregorianFromBadiYear(this.getYear() + 1);
      var nextYearNawRuz = (0, _Astronomy.getUTCDateForNawRuzOnYear)(gregorianEnd);
      var daysToAdd = this.getDay() - 19 - 2; // Subtract 1 month.
      var gregorianStartOfDay = new Date(nextYearNawRuz.getTime() + daysToAdd * MillisPerDay);
      var gregorianSunset = (0, _Astronomy.getUTCDateForSunsetOnDate)(gregorianStartOfDay, this.getPlace());
      return (0, _Astronomy.incrementGregorianDays)(gregorianSunset, this.getHoursAfterSunset() / 24);
    }
  }]);

  return BadiDate;
}();

exports.default = BadiDate;


var MonthNames = ['Bahá', 'Jalál', 'Jamál', '‘Aẓamat', 'Núr', 'Raḥmat', 'Kalimát', 'Kamál', 'Asmá’', '‘Izzat', 'Mashíyyat', '‘Ilm', 'Qudrat', 'Qawl', 'Masá’il', 'Sharaf', 'Sulṭán', 'Mulk', 'Ayyám-i-Há', '‘Alá’'];