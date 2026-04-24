import ashNazg from 'eslint-config-ash-nazg';

export default /** @type {import('eslint').Linter.Config} */ ([
  {
    ignores: ['vendor']
  },
  ...ashNazg(['sauron', 'node']),
  {
    rules: {
    }
  }
]);
