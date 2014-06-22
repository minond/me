'use strict';

var Github = require('./src/sources/github'),
    every = require('./src/every'),
    weather = require('weather-js'),
    mongojs = require('mongojs');

var get_github_data = require('./src/getters/github'),
    get_weather_data = require('./src/getters/weather');

var me = mongojs('me', ['data']);

var github = new Github(
    process.env.GITHUB_OAUTH_USER,
    process.env.GITHUB_OAUTH_TOKEN
);

require('./src/upserts')(me.data);

every(12).hours(function () {
    var now = new Date(),
        since = new Date(now.setHours(0, 0, 0)),
        until = new Date(now.setHours(24, 0, 0));

    get_github_data(me.data, github, {
        since: since,
        until: until
    });
});

every.hour(function () {
    get_weather_data(me.data, weather, {
        search: 'Provo, UT'
    });
});
