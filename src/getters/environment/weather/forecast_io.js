'use strict';

var point = require('../../../point');

/**
 * gets a daily summary of the weather from forecast.io
 * @param {ForecastIo} forecast_io
 * @param {Object} storage
 * @param {moment.range} range
 * @param {Object} config
 */
module.exports = function (forecast_io, storage, range, config) {
    range.by('days', function (day) {
        forecast_io.forecast(config.latitude, config.longitude, day.unix()).then(function (forecast) {
            storage.push(point(point.type.ENVIRONMENT, point.subtype.WEATHER, day.toDate(), 'forecast.io', {
                summary: forecast.summary,
                icon: forecast.icon,
                min: forecast.temperatureMin,
                max: forecast.temperatureMax,
                wind: forecast.windSpeed,
                humidity: forecast.humidity,
                visibility: forecast.visibility,
                clouds: forecast.cloudCover,
                pressure: forecast.pressure,
                ozone: forecast.ozone
            }));
        });
    });
};
