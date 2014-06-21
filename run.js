'use strict';

var Github = require('./src/sources/github'),
    mongojs = require('mongojs');

var get_github_data = require('./src/getters/github');


// var db = mongojs('me', ['data']);
// db.data.insert({c:true});
// db.data.find(function () {
//     console.log(arguments);
//     db.close();
// });
// console.log(db.data)

var github = new Github(
    process.env.GITHUB_OAUTH_USER,
    process.env.GITHUB_OAUTH_TOKEN
);

get_github_data({}, github, {
    since: new Date('2014-06-10'),
    until: new Date('2014-06-20')
});

// var weather = require('weather-js');
// weather.find({ search: 'Provo, UT', degreeType: 'F' }, function(err, data) {
//     if (!err) {
//         console.log(data);
//     }
// });
