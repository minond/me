'use strict';

var point = require('../../../point'),
    mime = require('mime'),
    log = require('debug')('getter:action:commits:github');

/**
 * @param {Github} github
 * @param {Object} storage
 * @param {moment.range} range
 */
module.exports = function (github, storage, range) {
    var dates = range.toDate(),
        until = dates.pop(),
        since = dates.pop();

    log('getting commits from %s to %s', since, until);
    github.repos().then(function (repos) {
        log('starting to download commits for %s repos', repos.length);
        repos.forEach(function (repo) {
            log('downloading commits for %s', repo.name);

            (function getcommits(page) {
                github.commits(repo.name, since, until, page).then(function (commits) {
                    if (commits.length) {
                        getcommits(page + 1);
                    } else {
                        if (page === 1) {
                            log('nothing commited in %s', repo.name);
                        }

                        return;
                    }

                    log('saving %s commits for %s', commits.length, repo.name);
                    commits.forEach(function (commit) {
                        github.commit(repo.name, commit.sha).then(function (commit) {
                            var entry = point(
                                point.type.ACTION,
                                point.subtype.COMMIT,
                                'github',
                                new Date(commit.commit.committer.date),
                                commit.sha,
                                {
                                    sha: commit.sha,
                                    url: commit.html_url,
                                    message: commit.commit.message,
                                    stats: commit.stats || {},
                                    files: []
                                }
                            );

                            if (commit.files) {
                                commit.files.forEach(function (file) {
                                    entry.data.files.push({
                                        name: file.filename,
                                        type: mime.lookup(file.filename)
                                    });
                                });
                            }

                            log('saving %o', entry);
                            storage.push(entry);
                        });
                    });
                });
            })(1);
        });
    });
};
