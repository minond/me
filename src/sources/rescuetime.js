'use strict';

var URL_BASE = 'rescuetime.com',
    URL_QUERY = '/anapi/data?format=json&key=${ user.api_key }';

var Api = require('./base/api'),
    lodash = require('lodash'),
    util = require('util');

/**
 * @class RescueTime
 * @extends Api
 * @param {string} api_key
 */
function RescueTime (api_key) {
    Api.call(this);

    /**
     * @property $log
     * @type {Function}
     */
    this.$log = require('debug')('rescuetime:api');

    /**
     * basic user info
     * @property $user
     * @type {Object}
     */
    this.$user = {
        api_key: api_key
    };
}

util.inherits(RescueTime, Api);

/**
 * @method $options
 * @param {string} path url path. can be a lodash template string
 * @param {Object} [fields]
 * @return {Object}
 */
RescueTime.prototype.$options = function (path, fields) {
    fields = lodash.defaults(fields || {}, {
        user: this.$user
    });

    return {
        host: URL_BASE,
        path: lodash.template(path, fields),

        // http://tinyurl.com/lq3mn29
        // http://nodejs.org/api/https.html#https_https_request_options_callback
        rejectUnauthorized: false,
    };
};

/**
 * @link https://www.rescuetime.com/anapi/setup/documentation
 * @method query
 * @return {Q.Promise}
 */
RescueTime.prototype.query = Api.request.https.get(URL_QUERY);

module.exports = RescueTime;
