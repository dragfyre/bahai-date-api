'use strict';
module.exports = {
  extends: ['ash-nazg/sauron-node', 'plugin:node/recommended-script'],
  rules: {
    'import/no-commonjs': 0,
    'node/exports-style': 0,

    // Browser
    'compat/compat': 0,

    // Prefer unicorn's version of the rule
    'no-process-exit': 0
  }
};
