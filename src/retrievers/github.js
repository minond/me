'use strict';

var API_BASE = 'api.github.com',
    API_COMMITS = '/repos/%s/%s/commits?author=%s&since=%s&until=%s',
    API_REPOSITORIES = '/users/%s/repos';

var Retriever = require('../retriever'),
    https = require('https'),
    util = require('util'),
    url = require('url'),
    lodash = require('lodash');

/**
 * @constructor
 * @class Github
 * @extends Retriever
 * @param {Object} config
 */
function Github(config) {
    Retriever.call(this, config);
}

util.inherits(Github, Retriever);

/**
 * downloads commit information
 * @method get_commits
 * @param {Function} callback
 */
Github.prototype.retrieve = function (callback) {
    var me = this,
        config = this.config,
        options = {};

    options.host = API_BASE;
    options.path = util.format(API_REPOSITORIES, config.user);
    options.auth = process.env.GITHUB_OAUTH_TOKEN + ':x-oauth-basic';
    options.headers = {};
    options.headers['User-Agent'] = config.user;

    /**
     * handles repositories callback
     * @function handle_repositories
     * @param {http.ServerResponse} res
     */
    function handle_repositories (res) {
        var done, msg, srr;

        var repos = [],
            buffers = [];

        res.on('data', function (buffer) {
            buffers.push(buffer);
        });

        res.on('end', function () {
            try {
                repos = JSON.parse(buffers.join(''));
                done = lodash.after(repos.length, callback);
            } catch (err) {
                msg = 'Error parsing response from repositories request';
                srr = new Error(msg);
                srr.previous = err;

                callback(srr);
            }

            // get all commits within date rance all repos
            lodash.each(repos, function (repo) {
                options.path = util.format(
                    API_COMMITS,
                    config.user,
                    repo.name,
                    config.user,
                    config.since.toISOString(),
                    config.until.toISOString()
                );

                https.get(options, handle_commits(repo, done))
                    .on('error', callback);
            });
        });
    }

    /**
     * handles commits callback
     * @function handle_commits
     * @param {Object} repo
     * @param {Function} done
     * @return {Function[http.ServerResponse(res)]}
     */
    function handle_commits (repo, done) {
        var msg, srr;

        var buffers = [],
            commits = [];

        return function (res) {
            res.on('data', function (buffer) {
                buffers.push(buffer);
            });

            res.on('end', function () {
                try {
                    commits = JSON.parse(buffers.join(''));
                } catch (err) {
                    msg = 'Error parsing response from commits request';
                    srr = new Error(msg);
                    srr.previous = err;

                    callback(srr);
                }

                me.emit(Retriever.EVENTS.data, repo, commits);
                done();
            });
        };
    }

    https.get(options, handle_repositories)
        .on('error', callback);
};

module.exports = Github;
