'use strict';

var TYPE = require('../../../point').type.ACTION,
    SUBTYPE = require('../../../point').subtype.COMMIT,
    SOURCE = 'github';

var point = require('../../../point'),
    mime = require('mime'),
    log = require('debug')('getter:action:commits:github');

/**
 * takes a commit object and returns a point to be saved
 * @param {Object} commit object we got back from Github.commit
 * @return {Point}
 */
function extract_commit_info(commit) {
    var date, entry;

    date = new Date(commit.commit.committer.date);
    entry = point(TYPE, SUBTYPE, SOURCE, date, commit.sha, {
        sha: commit.sha,
        url: commit.html_url,
        message: commit.commit.message,
        stats: commit.stats || {},
        files: []
    });

    if (commit.files) {
        commit.files.forEach(function (file) {
            entry.data.files.push({
                name: file.filename,
                type: mime.lookup(file.filename)
            });
        });
    }

    return entry;
}

/**
 * download commit info and saves it
 * @param {Github} github
 * @param {Object} storage
 * @param {Object} repo object sent back from Github.repos
 */
function save_commit_info(github, storage, repo) {
    return function (commit) {
        github.commit(repo.name, commit.sha).then(function (commit) {
            var entry = extract_commit_info(commit);

            log('saving %o', entry);
            storage.push(entry);
        });
    };
}

/**
 * downloads commits for a repo within a date range
 * @param {Github} github
 * @param {Object} storage
 * @param {Date} since
 * @param {Date} until
 */
function get_commits_for_repo(github, storage, since, until) {
    return function (repo) {
        log('downloading commits for %s', repo.name);

        (function getcommits(page) {
            github.commits(repo.name, since, until, page).then(function (commits) {
                if (commits.length) {
                    getcommits(page + 1);
                } else if (page === 1) {
                    log('nothing commited in %s', repo.name);
                }

                if (!commits.length) {
                    return;
                }

                log('saving %s commits for %s', commits.length, repo.name);
                commits.forEach(save_commit_info(github, storage, repo));
            });
        })(1);
    };
}

/**
 * gets all commits from all repos from github
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
        repos.forEach(get_commits_for_repo(github, storage, since, until));
    });
};
