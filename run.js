'use strict';

var Github = require('./src/retrievers/github');
var github = new Github({
    user: 'minond',
    since: new Date('2014-06-08 00:00:00'),
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
});

github.run();
