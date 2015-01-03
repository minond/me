'use strict';

// var point = require('../../../point'),
//     mime = require('mime');

/**
 * @param {Github} github
 * @param {Object} storage
 * @param {moment.range} range
 */
module.exports = function (github, storage, range) {
    var dates = range.toDate(),
        until = dates.pop(),
        since = dates.pop();

    github.repos().then(function (repos) {
        repos.forEach(function (repo) {
            github.commits(repo.name, since, until).then(function (commits) {
                commits.forEach(function (commit) {
                    github.commit(repo.name, commit.sha).then(function (commit) {
                        console.log(commit.sha);
                        console.log(commit.html_url);
                        console.log(commit.files);
                    });
                });
            });
        });
    });
    // range.by('days', function (day) {
    // });
};
