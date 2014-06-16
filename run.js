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
console.log('fetching repositories for %s', github.user.username);
github.repos().then(function (repos) {
    var repo_list = {};

    repos.forEach(function (repo) {
        repo_list[ repo.id ] = {
            name: repo.name,
            full_name: repo.full_name,
            url: repo.html_url
        };
    });

    repos.forEach(function (repo) {
        console.log('fetching commits for %s', repo.full_name);
        github.commits(repo, since, until).then(function (commits) {
            var commit_list = [];

            commits.forEach(function (commit) {
                commit_list.push({
                    sha: commit.sha,
                    url: commit.html_url,
                    message: commit.commit.message,
                    date: commit.commit.author.date,
                    repo: repo.id
                });
            });

            if (commit_list.length) {
                console.log('saving %s commit(s) for %s', commit_list.length, repo.full_name);
                console.log(commit_list);
            } else {
                console.log('no new commits for %s', repo.full_name);
            }
        });
    });
});
