var Joi = require('joi');
var currencyCodes = require('../currencyCodes.json')

module.exports = {
  query: {
    start_date: Joi.date().format('YYYY-MM-DD HH:mm:ss').required(),
    return_date: Joi.date().format('YYYY-MM-DD HH:mm:ss').optional(),
    adult_passengers: Joi.number().integer().greater(0).required(),
    origin:  Joi.string().required(),
    destination: Joi.string().required(),
    max_stops: Joi.number().integer().min(0).required(),
    max_price: Joi.number().integer().greater(0).required(),
    max_price_currency: Joi.any().valid(currencyCodes['ISO-4217-code']).required()
  }
};

