'use strict';

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
    range.by('days', function (day) {
        log('getting weather (%s, %s) data for %s', config.longitude, config.latitude, day);

        forecast_io.forecast(config.latitude, config.longitude, day.unix()).then(function (forecast) {
            var data = forecast.daily.data.shift(),
                entry = point(point.type.ENVIRONMENT, point.subtype.WEATHER, 'forecast.io', day.toDate(), day.unix(), {
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
