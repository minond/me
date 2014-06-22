'use strict';

var every = require('../src/every'),
    mongojs = require('mongojs'),
    me = mongojs('me', ['data']),
    storage = require('../src/upserts')(me.data),
    log = require('debug')('worker');

var Github = require('../src/sources/github'),
    weather = require('weather-js');

var get_github_data = require('../src/getters/github'),
    get_weather_data = require('../src/getters/weather');

// check mongo connection
every.hour(function () {
    log('checking mongo stats');
    me.stats(function (err, stats) {
        if (err) {
            log('error while checking mongo stats: %s', err.message);
            log('ending worker process');
            process.exit(1);
        } else if (!stats.ok) {
            log('mongo connection failure');
            log('ending worker process');
            process.exit(1);
        } else {
            log('mongo connection up and running');
        }
    });
});

// github data
every(12).hours(function () {
    var now = new Date(),
        since = new Date(now.setHours(0, 0, 0)),
        until = new Date(now.setHours(24, 0, 0));

    var github = new Github(
        process.env.GITHUB_OAUTH_USER,
        process.env.GITHUB_OAUTH_TOKEN
    );

    get_github_data(storage, github, {
        since: since,
        until: until
    });
});

// weather data
every.hour(function () {
    get_weather_data(storage, weather, {
        search: 'Provo, UT'
    });
});
