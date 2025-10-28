import ashNazg from 'eslint-config-ash-nazg';

export default [
  {
    ignores: ['vendor']
  },
  ...ashNazg(['sauron', 'node']),
  {
    rules: {
    }
  }
];
