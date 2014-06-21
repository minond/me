'use strict';

var Entry = require('../entry'),
    log = require('debug')('weather:getter');

/**
 * @function get_weather_data
 * @param {Object} storage
 * @param {Object} weather
 * @param {Object} filters
 */
function get_weather_data (storage, weather, filters) {
    var entry;

    if (!filters.degreeType) {
        filters.degreeType = 'F';
    }

    log('getting weather for %s', filters.search);
    weather.find(filters, function(err, data) {
        if (!err) {
            data = data.pop();
            entry = new Entry('weather', {
                loc: data.location.name,
                lat: data.location.lat,
                long: data.location.long,
                degreetype: data.location.degreetype,
                skytext: data.current.skytext,
                temperature: data.current.temperature,
                feelslike: data.current.feelslike,
                humidity: data.current.humidity,
                windspeed: data.current.windspeed
            });

            log('saving %s', entry.id());
        } else {
            log('error getting data: %s', err.message);
        }
    });
}

module.exports = get_weather_data;
