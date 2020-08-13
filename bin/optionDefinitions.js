'use strict';

const pkg = require('../package.json');

/* eslint-disable jsdoc/require-property -- Schema is already below */
/**
* @typedef {PlainObject} CoveradgeOptions
*/
/* eslint-enable jsdoc/require-property -- Schema is already below */

const optionDefinitions = [
  {
    name: 'date', alias: 'd', type: String, defaultOption: true,
    description: 'Gregorian date (parseable by `Date`) to convert to ' +
      'Badí\' date (or empty to get today\'s date).',
    typeLabel: '{underline date}'
  },
  {
    name: 'verbose', type: Boolean,
    description: 'Whether to provide an entire JSON object with full details.'
  }
];

const cliSections = [
  {
    // Add italics: `{italic textToItalicize}`
    content: pkg.description +
      '\n\n{italic bahai-date [--verbose] [aDate]}'
  },
  {
    optionList: optionDefinitions
  }
];

exports.definitions = optionDefinitions;
exports.sections = cliSections;
