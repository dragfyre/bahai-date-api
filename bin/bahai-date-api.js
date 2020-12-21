#!/usr/bin/env node
'use strict';

const {join} = require('path');
const {cliBasics} = require('command-line-basics');
const {
  getDate, getTodayJSON
} = require('../api/controllers/bDateController.js');

const optionDefinitions = cliBasics(
  join(__dirname, './optionDefinitions.js')
);

if (!optionDefinitions) { // cliBasics handled
  process.exit();
}

const {date, verbose} = optionDefinitions;

let dateObj;
if (date) {
  const dte = new Date(date);
  dateObj = getDate({
    year: dte.getFullYear(),
    month: dte.getMonth(),
    day: dte.getDate(),
    hour: dte.getHours(),
    minute: dte.getMinutes(),
    second: dte.getSeconds()
  });
} else {
  dateObj = getTodayJSON();
}

const output = verbose ? dateObj : dateObj.json.message;
// eslint-disable-next-line no-console -- CLI
console.log(output);
