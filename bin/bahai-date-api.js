#!/usr/bin/env node

import {dirname, join} from 'path';
import {fileURLToPath} from 'url';
import {cliBasics} from 'command-line-basics';
import {
  getDate, getTodayJSON
} from '../api/controllers/bDateController.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const optionDefinitions = await cliBasics(
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
