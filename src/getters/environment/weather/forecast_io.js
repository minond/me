'use strict';

/**
 * gets a daily summary of the weather from forecast.io
 * forecast.daily = {
 *   "data": [
 *     {
 *       "time": 1420009200,
 *       "summary": "Clear throughout the day.",
 *       "icon": "clear-day",
 *       "sunriseTime": 1420037422,
 *       "sunsetTime": 1420071084,
 *       "moonPhase": 0.36,
 *       "precipIntensity": 0,
 *       "precipIntensityMax": 0,
 *       "precipProbability": 0,
 *       "temperatureMin": 4.7,
 *       "temperatureMinTime": 1420027200,
 *       "temperatureMax": 19.56,
 *       "temperatureMaxTime": 1420059600,
 *       "apparentTemperatureMin": -2.31,
 *       "apparentTemperatureMinTime": 1420038000,
 *       "apparentTemperatureMax": 19.56,
 *       "apparentTemperatureMaxTime": 1420059600,
 *       "dewPoint": -0.9,
 *       "humidity": 0.59,
 *       "windSpeed": 2.64,
 *       "windBearing": 58,
 *       "visibility": 10,
 *       "cloudCover": 0.06,
 *       "pressure": 1034.85,
 *       "ozone": 302.61
 *     }
 *   ]
 * }
 */
var point = require('../../../point');

/**
 * @param {ForecastIo} forecast_io
 * @param {Object} storage
 * @param {moment.range} range
 * @param {Object} config
 */
module.exports = function (forecast_io, storage, range, config) {
    range.by('days', function (day) {
        forecast_io.forecast(config.latitude, config.longitude, day.unix()).then(function (forecast) {
            console.log(day);
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
