'use strict';

var Github = require('./src/sources/github');

var now = new Date(),
    since = new Date(now.setHours(0, 0, 0)),
    until = new Date(now.setHours(24, 0, 0));

var github = new Github(
    process.env.GITHUB_OAUTH_USER,
    process.env.GITHUB_OAUTH_TOKEN
);

console.log('getting commits from %s to %s', since, until);
github.repos().then(function (repos) {
    var data = {};

    repos.forEach(function (repo) {
        data[ repo.id ] = {
            name: repo.name,
            full_name: repo.full_name,
            url: repo.html_url
        };
    });

    console.log(data);

    repos.forEach(function (repo) {
        github.commits(repo, since, until).then(function (commits) {
            var data = [];

            commits.forEach(function (commit) {
                data.push({
                    sha: commit.sha,
                    url: commit.html_url,
                    repo: repo.id
                });
            });

            console.log(data);
        });
    });
});
