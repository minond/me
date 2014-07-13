'use strict';

var mongojs = require('mongojs'),
    me = mongojs('me', ['data']),
    log = require('debug')('worker'),
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
 * check we're still connected to mongo. kill process on error
 * @function check_mongo_connection
 */
module.exports.check_mongo_connection = function () {
    log('checking mongo stats');
    me.stats(function (err, stats) {
        if (err) {
            log('error while checking mongo stats: %s', err.message);
            log('ending worker process');
            process.exit(1);
        } else if (!stats.ok) {
            log('mongo connection failure');
            log('ending worker process');
            process.exit(1);
        } else {
            log('mongo connection up and running');
        }
    });
};

/**
 * gets local weather data
 * @function get_weather
 */
module.exports.get_weather = function () {
    get_weather_data(me.data, weather);
};
