'use strict';

var METHOD_USER_GET_RECENT_TRACKS = 'user.getrecenttracks';

var URL_BASE = 'ws.audioscrobbler.com',
    URL_METHOD = '/2.0/?format=json&' +
        'method=${ method }&' +
        'api_key=${ token }&' +
        'user=${ username }&' +
        'page=${ page }&' +
        'from=${ since.getTime() }&' +
        'to=${ until.getTime() }';

var Api = require('./base/api'),
    lodash = require('lodash'),
    util = require('util');

/**
 * @constructor
 * @class Lastfm
 * @param {string} username
 * @param {string} token
 */
function Lastfm (username, token) {
    Api.call(this);

    /**
     * @property $log
     * @type {Function}
     */
    this.$log = require('debug')('lastfm:api');

    /**
     * basic user info
     * @property user
     * @type {Object}
     */
    this.$user = {
        username: username,
        token: token
    };
}

util.inherits(Lastfm, Api);

/**
 * includes token in url
 *
 * @function get_options
 * @param {string} path url path. can be a lodash template string
 * @param {Object} [fields]
 * @return {Object}
 */
Lastfm.prototype.$options = function (method, fields) {
    fields = lodash.defaults(fields || {}, {
        token: this.$user.token,
        username: this.$user.username,
        method: method,
        page: 1
    });

    return {
        host: URL_BASE,
        path: lodash.template(URL_METHOD, fields)
    };
};

/**
 * gets recently played tracks
 *
 * @link http://www.last.fm/api/show/user.getRecentTracks
 * @method getRecentTracks
 * @param {Date} [since]
 * @param {Date} [until]
 * @param {int} [page]
 * @return {Q.Promise}
 */
Lastfm.prototype.getrecenttracks = Api.request.http(METHOD_USER_GET_RECENT_TRACKS, ['since', 'until', 'page']);

module.exports = Lastfm;
