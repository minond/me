'use strict';

var mongojs = require('mongojs'),
    me = mongojs('me', ['data']),
    log = require('debug')('worker'),
    config = require('../config/getters');

// sources
var Weather = require('./sources/weather'),
    Csv = require('./sources/csv');

// getters
var get_weather_data = require('./getters/weather'),
    get_sleep_cycle_data = require('./getters/sleep_cycle');

// connections
var weather = new Weather(config.weather.static_location);


var sleep = new Csv(config.sleep_cycle.files, {
    delimiter: ';',
    required_columns: ['start', 'end']
});

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

/**
 * parses csv output from my sleep cycle app
 * @function get_sleep_cycle
 */
module.exports.get_sleep_cycle = function () {
    get_sleep_cycle_data(me.data, sleep);
};
