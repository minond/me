'use strict';

var Github = require('./src/retrievers/github');
var github = new Github({
    user: process.env.GITHUB_OAUTH_USER,
    token: process.env.GITHUB_OAUTH_TOKEN,
    since: new Date('2014-06-11 00:00:00'),
    until: new Date('2014-06-11 23:59:00')
});

github.on('start', function () {
    console.log('getting commits');
});

github.on('end', function () {
    console.log('done getting commits');
});

github.on('error', function () {
    console.log('error getting commits');
});

github.on('data', function (repo, commits) {
    console.log('%s, %s commits', repo.name, commits.length);
    // console.log(commits);

    // if (commits.length)
    //     console.log(commits[0].commit.committer.date);
});

github.run();
