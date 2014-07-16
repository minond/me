'use strict';

var URL_BASE = 'api.forecast.io',
    URL_FORECAST = '/forecast/${ user.api_key }/${ latitude },${ longitude }' +
        '<% if (time) { %>,${ time }<% } %>';

var Api = require('./base/api'),
    lodash = require('lodash'),
    util = require('util');

/**
 * @class ForecaseIo
 * @extends Api
 * @param {string} api_key
 */
function ForecaseIo (api_key) {
    Api.call(this);

    /**
     * @property $user
     * @type {Object}
     */
    this.$user = {
        api_key: api_key
    };

    /**
     * @property $log
     * @type {Function}
     */
    this.$log = require('debug')('forecast_io:api');
}

util.inherits(ForecaseIo, Api);

/**
 * includes forecast.io api key
 *
 * @method $options
 * @param {string} path url path. can be a lodash template string
 * @param {Object} [fields]
 * @return {Object}
 */
ForecaseIo.prototype.$options = function (path, fields) {
    fields = lodash.defaults(fields || {}, {
        user: this.$user,
        time: undefined
    });

    return {
        host: URL_BASE,
        path: lodash.template(path, fields),
    };
};

/**
 * @link https://developer.forecast.io/docs/v2
 * @example res.currently
 *     "currently": {
 *         "time": 1405488312,
 *         "summary": "Overcast",
 *         "icon": "cloudy",
 *         "precipIntensity": 0.0028,
 *         "precipIntensityError": 0.0014,
 *         "precipProbability": 0.08,
 *         "precipType": "rain",
 *         "temperature": 75.2,
 *         "apparentTemperature": 75.2,
 *         "dewPoint": 51,
 *         "humidity": 0.43,
 *         "windSpeed": 8.37,
 *         "windBearing": 203,
 *         "visibility": 10,
 *         "cloudCover": 0.97,
 *         "pressure": 1010.19,
 *         "ozone": 292.73
 *     }
 *
 * @example res.daily.data
 *     "daily": {
 *         "data": [
 *             {
 *                 "time": 1405404000,
 *                 "summary": "Drizzle starting in the evening.",
 *                 "icon": "rain",
 *                 "sunriseTime": 1405426258,
 *                 "sunsetTime": 1405479390,
 *                 "moonPhase": 0.62,
 *                 "precipIntensity": 0.0022,
 *                 "precipIntensityMax": 0.0069,
 *                 "precipIntensityMaxTime": 1405483200,
 *                 "precipProbability": 1,
 *                 "precipType": "rain",
 *                 "temperatureMin": 70.12,
 *                 "temperatureMinTime": 1405429200,
 *                 "temperatureMax": 93.05,
 *                 "temperatureMaxTime": 1405461600,
 *                 "apparentTemperatureMin": 70.12,
 *                 "apparentTemperatureMinTime": 1405429200,
 *                 "apparentTemperatureMax": 89.96,
 *                 "apparentTemperatureMaxTime": 1405461600,
 *                 "dewPoint": 50.45,
 *                 "humidity": 0.35,
 *                 "windSpeed": 1.27,
 *                 "windBearing": 248,
 *                 "visibility": 10,
 *                 "cloudCover": 0.49,
 *                 "pressure": 1011.92,
 *                 "ozone": 293.41
 *             }
 *         ]
 *     }
 *
 * @method forecast
 * @param {float} latitude
 * @param {float} longitude
 * @return {Q.Promise}
 */
ForecaseIo.prototype.forecast = Api.request.https.get(URL_FORECAST, ['latitude', 'longitude', 'time']);

module.exports = ForecaseIo;
