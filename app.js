// BASE SETUP
// ==============================================

var express = require('express')
,   app     = express()
,   logger = require('morgan')
,   conf = require('./config.json')
,   validate = require('express-validation')
,   flightApiValidation = require('./validation/flights')
,   flightsModel = require('./models.js')
,   request = require('request');

app.use(logger('dev'));

function queryGoogleQpxApi(params, callback){

  // To get return flights a second (optional) request has to be made to the
  // Google QPX API with origin and destination interchanged and the start date
  // set to the return date.

  // JSON to be passed to the QPX Express API
  var requestData = {
    'request': {
      'passengers': {
        'adultCount': params['adult_passengers']
      },
      'slice': [
        {
          'origin': params['origin'],
          'destination': params['destination'],
          'date': new Date(params['start_date']).toLocaleDateString('us-US', {
            day : 'numeric',
            month : 'numeric',
            year : 'numeric'
          }),
          'maxStops': params['max_stops']
        }
      ],
      'maxPrice': params['max_price_currency'] + params['max_price'],
      'solutions': 1
    }
  };

  // QPX REST API URL
  var googleApiUrl = 'https://www.googleapis.com/qpxExpress/v1/trips/search?key=' + conf.googleDevApiKey;
  // fire request

  request({
    url: googleApiUrl,
    method: "POST",
    json: true,
    body: requestData
  },function(error, response, body) {
    if (!error && response.statusCode === 200 && !body.error) {
      console.log('BODY', body)
      callback(null, body);
    }
    else {
      if (body.error){
        callback(body.error, body);
      }
      else{
        callback(error, body);
      }
    }
  })
}

// TEST QUERY
// ==============================================
// /flights?start_date=2016-07-14%2018:36:55&return_date=2016-07-24%2018:36:21&adult_passengers=1&origin=SFO&destination=LAX&max_stops=2&max_price=250&max_price_currency=USD

// flight API calllback
function flightApiResponse(req, res, next) {

  // first query the google QPX Express API with the req.query params
  queryGoogleQpxApi(req.query, function(err, data){
    // querying the google API  went wrong
    if(err) {
       //console.log(data);
       return next(err);
     }
     else{
       // check if results contain any flights
       if (!(data.trips.data && data.trips.tripOption)){
         return res.send({'empty': 'No flights found!'});
       }
       // save the data to the model
       var flightData = flightsModel.create();
       // set the model attributes
       flightData.departureTime(new Date(data.trips.tripOption[0].slice[0].segment[0].leg[0].departureTime).toLocaleDateString('us-US',{
         hour: 'numeric',
         minute: 'numeric',
         second: 'numeric'}));
       flightData.arrivalTime(new Date(data.trips.tripOption[0].slice[0].segment[0].leg[0].arrivalTime).toLocaleDateString('us-US',{
         hour: 'numeric',
         minute: 'numeric',
         second: 'numeric'}));
       flightData.origin(data.trips.data.city[1].name);
       flightData.destination(data.trips.data.city[0].name);
       flightData.flightDuration(data.trips.tripOption[0].slice[0].segment[0].duration);
       flightData.aircraftType(data.trips.data.aircraft[0].name);
       flightData.price(data.trips.tripOption[0].saleTotal);

       //Invoke validations and wait for the validations to fulfill
       flightData.validate().then(function() {
         if (flightData.isValid) {
           //validated, perform business logic
           res.send(flightData.toJSON());
         } else {
           //validation failed, pass validation errors
           return next(flightData.errors);
         }
       });
     }
  });
}
// ROUTES
// ==============================================
// routes will go here

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