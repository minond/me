'use strict';

var TYPE = require('../../../point').type.ENVIRONMENT,
    SUBTYPE = require('../../../point').subtype.WEATHER,
    SOURCE = 'forecast.io';

var point = require('../../../point'),
    log = require('debug')('getter:environment:weather:forecast_io');

/**
 * gets a daily summary of the weather from forecast.io
 * @param {ForecastIo} forecast_io
 * @param {Object} storage
 * @param {moment.range} range
 * @param {Object} config
 */
module.exports = function (forecast_io, storage, range, config) {
    var lon = config.longitude,
        lat = config.latitude;

    range.by('days', function (day) {
        log('getting weather (%s, %s) data for %s', lon, lat, day);

        forecast_io.forecast(lat, lon, day.unix()).then(function (forecast) {
            var data = forecast.daily.data.shift(),
                entry = point(TYPE, SUBTYPE, SOURCE, day.toDate(), day.unix(), {
                    summary: data.summary,
                    icon: data.icon,
                    min: data.temperatureMin,
                    max: data.temperatureMax,
                    wind: data.windSpeed,
                    humidity: data.humidity,
                    visibility: data.visibility,
                    clouds: data.cloudCover,
                    pressure: data.pressure,
                    ozone: data.ozone
                });

            log('saving %o', entry);
            storage.push(entry);
        });
    });
};
