import createServer from './createServer.js';

const port = process.argv[2] || 1844;

const app = createServer();

app.listen(port);

// eslint-disable-next-line no-console -- CLI
console.log('Baha\'i Date RESTful API server started: Port ' + port);
