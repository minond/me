'use strict';

var mongojs = require('mongojs'),
    me = mongojs('me', ['data']),
    config = require('../config/getters');

// sources
var Weather = require('./sources/weather');

// getters
var get_weather_data = require('./getters/weather');

// connections
var weather = new Weather(config.weather.static_location);



 // adds an "upserrt" method to a collection object
(function (coll) {
    coll.upsert = (function () {
        var log = require('debug')('mongo');

        return function (entry) {
            var query = { id: entry.id() },
                options = { upsert: true },
                data = entry.json();

            coll.update(query, data, options, function (err) {
                if (!err) {
                    log('succesfully saved %s', entry.id());
                } else {
                    log('error saving %s: %s', entry.id(), err.message);
                }
            });
        };
    })();
})(me.data);


/**
 * gets local weather data
 * @function get_weather
 */
module.exports.get_weather = function () {
    get_weather_data(me.data, weather);
};
