import express = require('express');
import path = require('path');
import favicon = require('serve-favicon');
import logger = require('morgan');
import bodyParser = require('body-parser');
import cors = require('cors');
import fs = require('fs');
import http = require('http');
import https = require('https');
import { default as routes } from './routes';

let certificate, key, credentials;
try {
  certificate = fs.readFileSync('/ssl/cert1.pem', 'utf-8');
  key = fs.readFileSync('/ssl/privkey1.pem', 'utf-8');
  credentials = {
    cert: certificate,
    key: key
  }
} catch(e) {
  console.log('Unable to locate resources for SSL');
}

const app = express();

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

for (const route in routes) {
  app.use('/' + route, routes[route]);
}

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

/*
 * Start Server
 */

const port = normalizePort(process.env.PORT || '3000');

let server = null;
if (process.env.ENV === 'prod') {
  console.log('Starting secure web server.');
  app.set('port', 443);
  server = https.createServer(credentials, app);
} else {
  console.log('Starting web server.');
  app.set('port', port);
  server = http.createServer(app);
}

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log(`Server started on port ${addr.port}`);
}

module.exports = app;
