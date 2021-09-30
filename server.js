//require('dotenv-safe').config();
//var db = require('./mygrimorio.json');
const http = require('http');
//const express = require('express');
//const app = express();
const app = require('./src/app');
const debug = require('debug')('nodestr:server');


// PORT // based on express-generator
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

const port = normalizePort(process.env.PORT || 3000);
app.set('port', port);

// error handler
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);

    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);

    default:
      throw error;
  }
}

// listener handler
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

// server
const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
console.log(`API is alive on ${port}!`);

/*

const bodyParser = require('body-parser');
const {generateJWT, verifyJWT, getIdByToken} = require('./utils/helpers');
const {PORT, IP} = require('./utils/constants');

app.use(bodyParser.json());


const server = http.createServer(app);
server.listen(PORT, IP);
console.log('Servidor escutando no IP: ' + IP + ' na porta 3000...');
*/