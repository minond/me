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

var Api = require('./api'),
    lodash = require('lodash'),
    util = require('util'),
    log = require('debug')('github:api');

/**
 * @constructor
 * @class Github
 * @param {string} username
 * @param {string} token
 */
function Github (username, token) {
    Api.call(this);

    /**
     * basic user info
     * @property $user
     * @type {Object}
     */
    this.$user = {
        username: username,
        token: token
    };

    /**
     * includes github tokens/username
     *
     * @method $options
     * @param {string} path url path. can be a lodash template string
     * @param {Object} [fields]
     * @return {Object}
     */
    this.$options = function (path, fields) {
        fields = lodash.defaults(fields || {}, {
            user: this.$user,
            page: 1
        });

        return {
            host: URL_BASE,
            path: lodash.template(path, fields),
            auth: this.$user.token + ':x-oauth-basic',
            headers: {
                'User-Agent': this.$user.username
            }
        };
    }
};

util.inherits(Github, Api);

/**
 * gets all repos for user
 *
 * @method repos
 * @return {Q.Promise}
 */
Github.prototype.repos = Api.request(URL_REPOSITORIES);

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
Github.prototype.commits = Api.request(URL_COMMITS, ['repo', 'since', 'until', 'page']);

/**
 * gets a single commit
 *
 * @method commit
 * @param {Object} repo
 * @param {Object} commit
 * @return {Q.Promise}
 */
Github.prototype.commit = Api.request(URL_COMMIT, ['repo', 'commit']);

module.exports = Github;
