'use strict';

var Entry = require('../entry'),
    log = require('debug')('weather:getter');

/**
 * @function get_weather_data
 * @param {Object} storage
 * @param {Weather} weather
 */
module.exports = function get_weather_data (storage, weather) {
    weather.get().then(function (data) {
        var dtstamp = new Date(data.current.date + ' ' +
            data.current.observationtime);

        var entry = new Entry('weather', +dtstamp, {
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

        entry.dtstamp = dtstamp;
        log('saving %s', entry.id());
        storage.upsert(entry);
    });
};
