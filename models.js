var model = require('nodejs-model');
var currencyCodes = require('./currencyCodes.json');
var regexString = currencyCodes['ISO-4217-code'].toString().replace(/,/g, '|');
//console.log(currencyCodes['ISO-4217-code'].toString().replace(/,/g, '|'));
var currencyRegex = new RegExp("^\\/" + regexString + "\\/\\$");
//console.log(currencyRegex);

var dateTimeRegex = /^(((19|[2-9]\d)\d{2})[\/\.-](0[13578]|1[02])[\/\.-](0[1-9]|[12]\d|3[01])\s(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]))$/
//create a new model definition _User_ and define _name_/_password_ attributes
var flights = model('flights').attr('departureTime', {
  validations: {
    presence: {
      message: 'Departure time is required!'
    },
    format: { with:  dateTimeRegex,
    allowBlank: false, message: 'The departure time format has to be YYYY-MM-DD HH:MM:SS'}
  }
}).attr('arrivalTime', {
  validations: {
    presence: {
      message: 'Arrival time is required!'
    },
    format: { with:  dateTimeRegex,
    allowBlank: false, message: 'The arrival time format has to be YYYY-MM-DD HH:MM:SS'}
  }
}).attr('origin', {
  validations: {
    presence: {
      message: 'Origin name is required!'
    }
  }
}).attr('destination', {
  validations: {
    presence: {
      message: 'Destination name is required!'
    }
  }
}).attr('flightDuration', {
  validations: {
    presence: {
      message: 'Flight duration is required!'
    },
    format: { with: /^[1-9][0-9]*$/,
    allowBlank: false, message: 'The flight duration has to be positive integer'}
  }
}).attr('aircraftType', {
  validations: {
    flength: { minimum: 1,
    allowBlank: true, message: 'Aircraft type value too short'}
  }
}).attr('price', {
  validations: {
    presence: {
      message: 'Maximal price currency is required!'
    },
    format: { with: currencyRegex,
    allowBlank: false, message: 'Maximal price currency has to be ISO-4217 conform'}
  }
});

module.exports = flights;