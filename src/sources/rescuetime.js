'use strict';

var TMPL_DATE = function (name) {
    return '${ ' + name + '.toISOString()' +
        '.split("T")' +
        '.shift()' +
    ' }';
};

var TMPL_DATA = '/anapi/data?format=json&version=0&key=${ user.api_key }&',
    TMPL_QUERY = TMPL_DATA + 'perspective=${ query.perspective }&' +
        'resolution_time=${ query.resolution_time}&' +
        'restrict_group=${ query.restrict_group }&' +
        'restrict_user=${ query.restrict_user }&' +
        'restrict_begin=' + TMPL_DATE('since') + '&' +
        'restrict_end=' + TMPL_DATE('until') + '&' +
        'restrict_kind=${ query.restrict_kind }&' +
        'restrict_project${ query.restrict_project }&' +
        'restrict_thing=${ query.restrict_thing }&' +
        'restrict_thingy=${ query.restrict_thingy }&';

var URL_BASE = 'rescuetime.com',
    URL_SELECT = TMPL_QUERY + 'operation=select';

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
        user: this.$user,
        query: lodash.defaults(fields.query || {}, {
            perspective: 'rank',
            resolution_time: 'hour',
            restrict_kind: 'activity'
        })
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
 * @method select
 * @return {Date} since
 * @return {Date} until
 * @return {Object} query
 * @return {Q.Promise}
 */
RescueTime.prototype.select = Api.request.https.get(URL_SELECT, ['since', 'until', 'query']);

module.exports = RescueTime;
