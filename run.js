'use strict';

var Github = require('./src/sources/github');

var since = new Date('2014-05-01 00:00:00'),
    until = new Date('2014-06-14 23:59:00');

var github = new Github(
    process.env.GITHUB_OAUTH_USER,
    process.env.GITHUB_OAUTH_TOKEN
);

github.repos().then(function (repos) {
    console.log(repos);

    repos.forEach(function (repo) {
        github.commits(repo, since, until).then(function (commits) {
            console.log(commits);
        });
    });
});
