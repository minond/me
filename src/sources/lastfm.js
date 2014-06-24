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

var Q = require('q'),
    lodash = require('lodash'),
    http = require('http'),
    log = require('debug')('lastfm:api');

/**
 * returns a function that joins a list of buffers, json decodes that, then
 * resolves a Q promise with that object
 *
 * @function resolve_buffers
 * @param {Q.deferred} deferred
 * @param {Array} buffers
 * @return {Function}
 */
function resolve_buffers (deferred, buffers) {
    return function () {
        var joined = JSON.parse(buffers.join(''));
        deferred.resolve(joined);
    };
}

/**
 * generates a request options object
 *
 * @function get_options
 * @param {string} path url path. can be a lodash template string
 * @param {Object} [fields]
 * @return {Object}
 */
function get_options (instance, method, fields) {
    fields = lodash.defaults(fields || {}, {
        token: instance.$user.token,
        username: instance.$user.username,
        method: method,
        page: 1
    });

    return {
        host: URL_BASE,
        path: lodash.template(URL_METHOD, fields)
    };
}

/**
 * generates an api call method
 *
 * @function api_request
 * @parma {string} url the end point (not including the base)
 * @param {Array} [arglist] optional arguments passed into the method and req
 * @return {Function}
 */
function api_request (url, arglist) {
    arglist = arglist || [];

    function fields (args) {
        var data = {};

        lodash.each(args, function (val, index) {
            data[ arglist[ index ] ] = val;
        });

        return data;
    }

    return function () {
        var deferred = Q.defer(),
            options = get_options(this, url, fields(arguments));

        log('requesting %s', options.path);
        http.get(options, function (res) {
            var buffers = [];

            log('downloading %s', options.path);
            res.on('data', buffers.push.bind(buffers));
            res.on('end', resolve_buffers(deferred, buffers));
        }).on('error', function () {
            log('error getting %s', options.path);
            deferred.reject(new Error('Error getting ' + options.path));
        });

        return deferred.promise;
    };
}

/**
 * @constructor
 * @class Lastfm
 * @param {string} username
 * @param {string} token
 */
function Lastfm (username, token) {
    /**
     * basic user info
     * @property user
     * @type {Object}
     */
    this.$user = {
        username: username,
        token: token
    };

    // rebind to parent object
    this.user = {
        getrecenttracks: this.user.getrecenttracks.bind(this)
    };
}

/**
 * holds all user methods
 * @property user
 * @type {Object}
 */
Lastfm.prototype.user = {};

/**
 * gets recently played tracks
 *
 * @link http://www.last.fm/api/show/user.getRecentTracks
 * @method user.getRecentTracks
 * @param {Date} [since]
 * @param {Date} [until]
 * @param {int} [page]
 * @return {Q.Promise}
 */
Lastfm.prototype.user.getrecenttracks = api_request(METHOD_USER_GET_RECENT_TRACKS, ['since', 'until', 'page']);

module.exports = Lastfm;
