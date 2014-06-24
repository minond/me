'use strict';

var URL_BASE = 'api.github.com',
    URL_REPOSITORIES = '/users/${ user.username }/repos',
    URL_COMMIT = '/repos/${ user.username }/${ repo.name }/commits/${ commit.sha }',
    URL_COMMITS = '/repos/${ user.username }/${ repo.name }/commits?' +
        'author=${ user.username }&' +
        'since=${ since.toISOString() }&' +
        'until=${ until.toISOString() }&' +
        'per_page=100&' +
        'page=${ page }';

var Q = require('q'),
    lodash = require('lodash'),
    https = require('https'),
    log = require('debug')('github:api');

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
 * @param {Object} instance
 * @param {string} path url path. can be a lodash template string
 * @param {Object} [fields]
 * @return {Object}
 */
function get_options (instance, path, fields) {
    fields = lodash.defaults(fields || {}, {
        user: instance.user,
        page: 1
    });

    return {
        host: URL_BASE,
        path: lodash.template(path, fields),
        auth: instance.user.token + ':x-oauth-basic',
        headers: {
            'User-Agent': instance.user.username
        }
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
        https.get(options, function (res) {
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
 * @class Github
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
 * gets all repos for user
 *
 * @method repos
 * @return {Q.Promise}
 */
Github.prototype.repos = api_request(URL_REPOSITORIES);

/**
 * gets commits for repo within time period
 *
 * @method commits
 * @param {Object} repo
 * @param {Date} [since]
 * @param {Date} [until]
 * @param {int} [page]
 * @return {Q.Promise}
 */
Github.prototype.commits = api_request(URL_COMMITS, ['repo', 'since', 'until', 'page']);

/**
 * gets a single commit
 *
 * @method commit
 * @param {Object} repo
 * @param {Object} commit
 * @return {Q.Promise}
 */
Github.prototype.commit = api_request(URL_COMMIT, ['repo', 'commit']);

module.exports = Github;
