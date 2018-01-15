import express = require('express');
import path = require('path');
import favicon = require('serve-favicon');
import logger = require('morgan');
import bodyParser = require('body-parser');
import cors = require('cors');

import { default as routes } from './routes';

const app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({ origin: 'http://localhost:4200' }));
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

app.listen(3000, () => {
    console.log('Star Wars app listening on port 3000');
});

module.exports = app;
