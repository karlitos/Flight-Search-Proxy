// BASE SETUP
// ==============================================

var express = require('express')
,   app     = express()
,   logger = require('morgan')
,   conf = require('./config.json')
,   validate = require('express-validation')
,   flightApiValidation = require('./validation/flights');

 app.use(logger('dev'));
// ROUTES
// ==============================================
// routes will go here

// flight API calllback
function flightApiResponse(req, res) {
  console.log('Route reached!', req.query);
  res.send('this is a sample!');
}

// flights route
app.get('/flights', validate(flightApiValidation), flightApiResponse);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// ==============================================
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500).send(
      {
        message: err.message,
        error: err
      });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500).send(
    {
      message: err.message,
      error: {}
    });
});

// EXPORT FOR THE SERVER
// ==============================================
module.exports = app;