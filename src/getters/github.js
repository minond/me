'use strict';

var Entry = require('../entry'),
    log = require('debug')('github:getter'),
    mime = require('mime');

/**
 * @function get_github_data
 * @param {Object} storage
 * @param {Github} github
 * @param {Object} filters
 */
module.exports = function get_github_data (storage, github, filters) {
    var since = filters.since,
        until = filters.until;

    log('getting commits from %s to %s', since, until);
    log('fetching repositories for %s', github.user.username);

    github.repos().then(function (repos) {
        repos.forEach(function (repo) {
            log('fetching commits for %s', repo.full_name);

            github.commits(repo, since, until).then(function (commits) {
                commits.forEach(function (commit) {
                    github.commit(repo, commit).then(function (commit) {
                        var entry = new Entry('commit', repo.id + commit.sha, {
                            sha: commit.sha,
                            url: commit.html_url,
                            message: commit.commit.message,
                            stats: commit.stats,
                            files: [],
                            repository: {
                                id: repo.id,
                                name: repo.name,
                                full_name: repo.full_name,
                                url: repo.html_url
                            }
                        });

                        entry.dtstamp = new Date(commit.commit.author.date);
                        commit.files.forEach(function (file) {
                            entry.data.files.push({
                                name: file.filename,
                                type: mime.lookup(file.filename)
                            });
                        });

                        log('saving %s', entry.id());
                        storage.upsert(entry);
                    });
                });
            });
        });
    });
};
