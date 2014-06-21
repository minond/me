'use strict';

var Github = require('./src/sources/github'),
    mongojs = require('mongojs'),
    mime = require('mime');

// var db = mongojs('me', ['data']);
// db.data.insert({c:true});
// db.data.find(function () {
//     console.log(arguments);
//     db.close();
// });
// console.log(db.data)

var now = new Date('2014-06-12'),
    since = new Date('2014-06-10'),
    until = new Date('2014-06-20');

var github = new Github(
    process.env.GITHUB_OAUTH_USER,
    process.env.GITHUB_OAUTH_TOKEN
);






var weather = require('weather-js');
weather.find({ search: 'Provo, UT', degreeType: 'F' }, function(err, data) {
    if (!err) {
        console.log(data);
    }
});

console.log('getting commits from %s to %s', since, until);
console.log('fetching repositories for %s', github.user.username);
github.repos().then(function (repos) {
    repos.forEach(function (repo) {
        console.log('fetching commits for %s', repo.full_name);
        github.commits(repo, since, until).then(function (commits) {
            commits.forEach(function (commit) {
                github.commit(repo, commit).then(function (commit) {
                    var data, files = [];

                    commit.files.forEach(function (file) {
                        files.push({
                            name: file.filename,
                            type: mime.lookup(file.filename)
                        });
                    });

                    data = {
                        id: repo.id + '-' + commit.sha,
                        sha: commit.sha,
                        url: commit.html_url,
                        message: commit.commit.message,
                        dtdate: commit.commit.author.date,
                        stats: commit.stats,
                        files: files,
                        repository: {
                            id: repo.id,
                            name: repo.name,
                            full_name: repo.full_name,
                            url: repo.html_url
                        }
                    };

                    console.log('saving %s', data.id);
                });
            });
        });
    });
});
