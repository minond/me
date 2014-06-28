'use strict';

var Q = require('q'),
    weather = require('weather-js'),
    log = require('debug')('weather:api');

/**
 * @constructor
 * @class Weather
 * @param {string} loc
 */
function Weather (loc) {
    /**
     * location
     * @property $loc
     * @type {string}
     */
    this.$loc = loc;
}

/**
 * @method get
 * @return {Q.Promise}
 */
Weather.prototype.get = function () {
    var deferred = Q.defer(),
        filters = {
            degreeType: 'F',
            search: this.$loc
        };

    log('getting weather for %s', filters.search);
    weather.find(filters, function(err, data) {
        if (err) {
            deferred.reject(err);
            return;
        }

        deferred.resolve(data.pop());
    });

    return deferred.promise;
};

module.exports = Weather;
