'use strict';

var URL_BASE = 'api.github.com',
    URL_COMMITS = '/repos/${ user.username }/${ repo.name }/commits?author=${ user.username }&since=${ since.toISOString() }&until=${ until.toISOString() }',
    URL_REPOSITORIES = '/users/${ user.username }/repos';

var Q = require('q'),
    lodash = require('lodash'),
    https = require('https'),
    util = require('util');

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
 * @param {string} username
 * @param {string} token
 */
function Github (username, token) {
    /**
     * basic user info
     * @property user
     * @type {Object}
     */
    this.user = {
        username: username,
        token: token
    };
}

/**
 * generates a request options object
 * @method options
 * @param {string} path url path. can be a lodash template string
 * @param {Object} [fields]
 * @return {Object}
 */
Github.prototype.options = function (path, fields) {
    fields = lodash.defaults(fields || {}, {
        user: this.user
    });

    return {
        host: URL_BASE,
        path: lodash.template(path, fields),
        auth: this.user.token + ':x-oauth-basic',
        headers: {
            'User-Agent': this.user.username
        }
    };
};

/**
 * gets all repos for user
 * @method repos
 * @return {Q.Promise}
 */
Github.prototype.repos = function () {
    var deferred = Q.defer(),
        options = this.options(URL_REPOSITORIES);

    https.get(options, function (res) {
        var buffers = [];

        res.on('data', buffers.push.bind(buffers));
        res.on('end', resolve_buffers(deferred, buffers));
    }).on('error', function () {
        deferred.reject(new Error('Error getting repositories'));
    });

    return deferred.promise;
};

/**
 * gets commits for repo within time period
 * @method commits
 * @param {Object} repo
 * @param {Date} [since]
 * @param {Date} [until]
 * @return {Q.Promise}
 */
Github.prototype.commits = function (repo, since, until) {
    var deferred = Q.defer(),
        options = this.options(URL_COMMITS, {
            repo: repo,
            since: since || new Date(),
            until: until || new Date()
        });

    https.get(options, function (res) {
        var buffers = [];

        res.on('data', buffers.push.bind(buffers));
        res.on('end', resolve_buffers(deferred, buffers));
    }).on('error', function () {
        deferred.reject(new Error('Error getting commits for ' + repo.name));
    });

    return deferred.promise;
};

module.exports = Github;
