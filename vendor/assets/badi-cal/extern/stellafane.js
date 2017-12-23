"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
The following code is brought to you by:
<!--
Stellafane Equinox & Solsticew Calculator for http://www.Stellafane.com
2004-Mar-07 KHS Created by Ken Slater
2006-Jun-15 KHS: New page format
2008-Mar-21 KHS: Fixed to work with Safari
2012-Feb-04 KHS: Updated to HTML5
Copyright 1999-2012 The Springfield Telescope Makers, Inc., All Rights Reserved.
-->

It's been modified in 2015 by Berkeley Churchill for the Badi Calendar app
*/

var EquinoxCalc = {

  vernal_equinox: function vernal_equinox(year) {
    return EquinoxCalc.calcEquiSol(1, year);
  },

  //-----Utility Funtions------------------------------------------------------------
  INT: function INT(n) {
    return Math.floor(n);
  }, // Emulates BASIC's INT Funtion
  POW2: function POW2(n) {
    return Math.pow(n, 2);
  }, // Square a number
  POW3: function POW3(n) {
    return Math.pow(n, 3);
  }, // Cube a number
  POW4: function POW4(n) {
    return Math.pow(n, 4);
  }, // Number to the 4th power
  COS: function COS(deg) {
    // Cosine function with degrees as input
    return Math.cos(deg * Math.PI / 180);
  },

  //-----Calculate and Display a single event for a single year (Either a Equiniox or Solstice)
  // Meeus Astronmical Algorithms Chapter 27
  calcEquiSol: function calcEquiSol(i, year) {
    var k = i - 1;
    var str;
    var JDE0 = EquinoxCalc.calcInitial(k, year); // Initial estimate of date of event
    var T = (JDE0 - 2451545.0) / 36525;
    var W = 35999.373 * T - 2.47;
    var dL = 1 + 0.0334 * EquinoxCalc.COS(W) + 0.0007 * EquinoxCalc.COS(2 * W);
    var S = EquinoxCalc.periodic24(T);
    var JDE = JDE0 + 0.00001 * S / dL; // This is the answer in Julian Emphemeris Days
    var TDT = EquinoxCalc.fromJDtoUTC(JDE); // Convert Julian Days to TDT in a Date Object
    var UTC = EquinoxCalc.fromTDTtoUTC(TDT); // Correct TDT to UTC, both as Date Objects
    return UTC;
  }, // End calcEquiSol

  //-----Calcualte an initial guess as the JD of the Equinox or Solstice of a Given Year
  // Meeus Astronmical Algorithms Chapter 27
  calcInitial: function calcInitial(k, year) {
    // Valid for years 1000 to 3000
    var JDE0 = 0,
        Y = (year - 2000) / 1000;
    switch (k) {
      case 0:
        JDE0 = 2451623.80984 + 365242.37404 * Y + 0.05169 * EquinoxCalc.POW2(Y) - 0.00411 * EquinoxCalc.POW3(Y) - 0.00057 * EquinoxCalc.POW4(Y);break;
      case 1:
        JDE0 = 2451716.56767 + 365241.62603 * Y + 0.00325 * EquinoxCalc.POW2(Y) + 0.00888 * EquinoxCalc.POW3(Y) - 0.00030 * EquinoxCalc.POW4(Y);break;
      case 2:
        JDE0 = 2451810.21715 + 365242.01767 * Y - 0.11575 * EquinoxCalc.POW2(Y) + 0.00337 * EquinoxCalc.POW3(Y) + 0.00078 * EquinoxCalc.POW4(Y);break;
      case 3:
        JDE0 = 2451900.05952 + 365242.74049 * Y - 0.06223 * EquinoxCalc.POW2(Y) - 0.00823 * EquinoxCalc.POW3(Y) + 0.00032 * EquinoxCalc.POW4(Y);break;
    }
    return JDE0;
  }, // End calcInitial

  //-----Calculate 24 Periodic Terms----------------------------------------------------
  // Meeus Astronmical Algorithms Chapter 27
  periodic24: function periodic24(T) {
    var A = new Array(485, 203, 199, 182, 156, 136, 77, 74, 70, 58, 52, 50, 45, 44, 29, 18, 17, 16, 14, 12, 12, 12, 9, 8);
    var B = new Array(324.96, 337.23, 342.08, 27.85, 73.14, 171.52, 222.54, 296.72, 243.58, 119.81, 297.17, 21.02, 247.54, 325.15, 60.93, 155.12, 288.79, 198.04, 199.76, 95.39, 287.11, 320.81, 227.73, 15.45);
    var C = new Array(1934.136, 32964.467, 20.186, 445267.112, 45036.886, 22518.443, 65928.934, 3034.906, 9037.513, 33718.147, 150.678, 2281.226, 29929.562, 31555.956, 4443.417, 67555.328, 4562.452, 62894.029, 31436.921, 14577.848, 31931.756, 34777.259, 1222.114, 16859.074);
    var S = 0;
    for (var i = 0; i < 24; i++) {
      S += A[i] * EquinoxCalc.COS(B[i] + C[i] * T);
    }
    return S;
  },

  //-----Correct TDT to UTC----------------------------------------------------------------
  fromTDTtoUTC: function fromTDTtoUTC(tobj) {
    // from Meeus Astronmical Algroithms Chapter 10
    // Correction lookup table has entry for every even year between TBLfirst and TBLlast
    var TBLfirst = 1620,
        TBLlast = 2002; // Range of years in lookup table
    var TBL = new Array( // Corrections in Seconds
    /*1620*/121, 112, 103, 95, 88, 82, 77, 72, 68, 63, 60, 56, 53, 51, 48, 46, 44, 42, 40, 38,
    /*1660*/35, 33, 31, 29, 26, 24, 22, 20, 18, 16, 14, 12, 11, 10, 9, 8, 7, 7, 7, 7,
    /*1700*/7, 7, 8, 8, 9, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 11, 11, 11,
    /*1740*/11, 11, 12, 12, 12, 12, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15, 15, 16, 16,
    /*1780*/16, 16, 16, 16, 16, 16, 15, 15, 14, 13,
    /*1800*/13.1, 12.5, 12.2, 12.0, 12.0, 12.0, 12.0, 12.0, 12.0, 11.9, 11.6, 11.0, 10.2, 9.2, 8.2,
    /*1830*/7.1, 6.2, 5.6, 5.4, 5.3, 5.4, 5.6, 5.9, 6.2, 6.5, 6.8, 7.1, 7.3, 7.5, 7.6,
    /*1860*/7.7, 7.3, 6.2, 5.2, 2.7, 1.4, -1.2, -2.8, -3.8, -4.8, -5.5, -5.3, -5.6, -5.7, -5.9,
    /*1890*/-6.0, -6.3, -6.5, -6.2, -4.7, -2.8, -0.1, 2.6, 5.3, 7.7, 10.4, 13.3, 16.0, 18.2, 20.2,
    /*1920*/21.1, 22.4, 23.5, 23.8, 24.3, 24.0, 23.9, 23.9, 23.7, 24.0, 24.3, 25.3, 26.2, 27.3, 28.2,
    /*1950*/29.1, 30.0, 30.7, 31.4, 32.2, 33.1, 34.0, 35.0, 36.5, 38.3, 40.2, 42.2, 44.5, 46.5, 48.5,
    /*1980*/50.5, 52.5, 53.8, 54.9, 55.8, 56.9, 58.3, 60.0, 61.6, 63.0, 63.8, 64.3); /*2002 last entry*/
    // Values for Delta T for 2000 thru 2002 from NASA
    var deltaT = 0; // deltaT = TDT - UTC (in Seconds)
    var Year = tobj.getUTCFullYear();
    var t = (Year - 2000) / 100; // Centuries from the epoch 2000.0

    if (Year >= TBLfirst && Year <= TBLlast) {
      // Find correction in table
      if (Year % 2) {
        // Odd year - interpolate
        deltaT = (TBL[(Year - TBLfirst - 1) / 2] + TBL[(Year - TBLfirst + 1) / 2]) / 2;
      } else {
        // Even year - direct table lookup
        deltaT = TBL[(Year - TBLfirst) / 2];
      }
    } else if (Year < 948) {
      deltaT = 2177 + 497 * t + 44.1 * EquinoxCalc.POW2(t);
    } else if (Year >= 948) {
      deltaT = 102 + 102 * t + 25.3 * EquinoxCalc.POW2(t);
      if (Year >= 2000 && Year <= 2100) {
        // Special correction to avoid discontinurity in 2000
        deltaT += 0.37 * (Year - 2100);
      }
    } else {
      alert("Error: TDT to UTC correction not computed");
    }
    return new Date(tobj.getTime() - deltaT * 1000); // JavaScript native time is in milliseonds
  }, // End fromTDTtoUTC

  //-----Julian Date to UTC Date Object----------------------------------------------------
  // Meeus Astronmical Algorithms Chapter 7
  fromJDtoUTC: function fromJDtoUTC(JD) {
    // JD = Julian Date, possible with fractional days
    // Output is a JavaScript UTC Date Object
    var A, alpha;
    var Z = EquinoxCalc.INT(JD + 0.5); // Integer JD's
    var F = JD + 0.5 - Z; // Fractional JD's
    if (Z < 2299161) {
      A = Z;
    } else {
      alpha = EquinoxCalc.INT((Z - 1867216.25) / 36524.25);
      A = Z + 1 + alpha - EquinoxCalc.INT(alpha / 4);
    }
    var B = A + 1524;
    var C = EquinoxCalc.INT((B - 122.1) / 365.25);
    var D = EquinoxCalc.INT(365.25 * C);
    var E = EquinoxCalc.INT((B - D) / 30.6001);
    var DT = B - D - EquinoxCalc.INT(30.6001 * E) + F; // Day of Month with decimals for time
    var Mon = E - (E < 13.5 ? 1 : 13); // Month Number
    var Yr = C - (Mon > 2.5 ? 4716 : 4715); // Year
    var Day = EquinoxCalc.INT(DT); // Day of Month without decimals for time
    var H = 24 * (DT - Day); // Hours and fractional hours
    var Hr = EquinoxCalc.INT(H); // Integer Hours
    var M = 60 * (H - Hr); // Minutes and fractional minutes
    var Min = EquinoxCalc.INT(M); // Integer Minutes
    var Sec = EquinoxCalc.INT(60 * (M - Min)); // Integer Seconds (Milliseconds discarded)
    //Create and set a JavaScript Date Object and return it
    var theDate = new Date(0);
    theDate.setUTCFullYear(Yr, Mon - 1, Day);
    theDate.setUTCHours(Hr, Min, Sec);
    return theDate;
  } //End fromJDtoUTC

};

exports.default = EquinoxCalc;