'use strict';

var every = require('../src/every'),
    mongojs = require('mongojs'),
    me = mongojs('me', ['data']),
    storage = require('../src/upserts')(me.data);

var Github = require('../src/sources/github'),
    weather = require('weather-js');

var get_github_data = require('../src/getters/github'),
    get_weather_data = require('../src/getters/weather');

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
