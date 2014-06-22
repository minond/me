'use strict';

var Github = require('./src/sources/github'),
    weather = require('weather-js'),
    mongojs = require('mongojs');

var get_github_data = require('./src/getters/github'),
    get_weather_data = require('./src/getters/weather');

// var db = mongojs('me', ['data']);
// db.data.insert({c:true});
// db.data.find(function () {
//     console.log(arguments);
//     db.close();
// });
// console.log(db.data)

var file_storage = {
    log: require('debug')('fs'),
    insert: function (entry) {
        var fs = require('fs');

        var path = 'public/data/' + entry.id() + '.json',
            data = JSON.stringify(entry);

        file_storage.log('writing to %s', path);
        fs.writeFile(path, data, function (err) {
            if (!err) {
                file_storage.log('success writing to %s', path);
            } else {
                file_storage.log('error writing to %s: %s', path, err.message);
            }
        });
    }
};

var github = new Github(
    process.env.GITHUB_OAUTH_USER,
    process.env.GITHUB_OAUTH_TOKEN
);

get_github_data(file_storage, github, {
    since: new Date('2014-06-10'),
    until: new Date('2014-06-22')
});

get_weather_data(file_storage, weather, {
    search: 'Provo, UT'
});
