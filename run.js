'use strict';

var Github = require('./src/sources/github'),
    weather = require('weather-js'),
    mongojs = require('mongojs');

var get_github_data = require('./src/getters/github'),
    get_weather_data = require('./src/getters/weather');

var me = mongojs('me', ['data']);

var github = new Github(
    process.env.GITHUB_OAUTH_USER,
    process.env.GITHUB_OAUTH_TOKEN
);

get_github_data(me.data, github, {
    since: new Date('2014-06-10'),
    until: new Date('2014-06-23')
});

get_weather_data(me.data, weather, {
    search: 'Provo, UT'
});
