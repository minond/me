'use strict';

var METHOD_USER_GET_RECENT_TRACKS = 'user.getrecenttracks';

var URL_BASE = 'ws.audioscrobbler.com',
    URL_METHOD = '/2.0/?format=json&' +
        'method=${ method }&' +
        'api_key=${ token }&' +
        'user=${ username }&' +
        'page=${ page }';

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
            options = this.options(url, fields(arguments));

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
 * generates a request options object
 *
 * @method options
 * @param {string} path url path. can be a lodash template string
 * @param {Object} [fields]
 * @return {Object}
 */
Lastfm.prototype.options = function (method, fields) {
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

Lastfm.prototype.user = {
    getrecenttracks: api_request(METHOD_USER_GET_RECENT_TRACKS, ['page'])
};





var lastfm = new Lastfm(
    process.env.LASTFM_USER,
    process.env.LASTFM_API_KEY
);

(function getrecenttracks (page) {
    lastfm.user.getrecenttracks(page || 1).then(function (user) {
        var attr = user.recenttracks['@attr'];

        if (attr.page < attr.totalPages) {
            getrecenttracks(+attr.page + 1);
        }

        // console.log(user.recenttracks.tracks);
        console.log('on page %s', attr.page);
    });
})();













