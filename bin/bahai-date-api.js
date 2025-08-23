#!/usr/bin/env node

import {cliBasics} from 'command-line-basics';
import {
  getDate, getTodayJSON
} from '../api/controllers/bDateController.js';

const optionDefinitions = await cliBasics(
  import.meta.dirname + '/optionDefinitions.js',
  {
    packageJsonPath: import.meta.dirname + '/../package.json'
  }
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
    month: dte.getMonth() + 1,
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
