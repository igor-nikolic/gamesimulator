const http = require('http');
const app = require('./server/app');

const normalizePort = val => {
  const port = parseInt(val, 10);
  if (Number.isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
};
const onError = error => {
  if (error.syscall !== 'listen') throw error;
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${port}`;

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} required elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${port}`;
  // debug(`Listening on ${bind}`);
};
server.on('error', onError);
server.on('listening', onListening);
server.listen(port, () => {console.log('aaa')});
