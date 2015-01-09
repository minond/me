'use strict';

var MongoClient = require('mongodb').MongoClient,
    ForecastIo = require('aping/client/forecast_io'),
    Github = require('aping/client/github');

var moment = require('moment-range'),
    argv = require('minimist')(process.argv.slice(2), {string: 'since'}),
    config = require('acm'),
    connect = require('./src/store');

var forecast_io_getter = require('./src/getters/environment/weather/forecast_io'),
    github_getter = require('./src/getters/action/commits/github');

var since = new Date(argv.since || Date.now()),
    until = new Date(argv.until || Date.now()),
    range = moment().range(since, until);

connect(MongoClient, config).then(function (store) {
    // commits from github
    github_getter(new Github({
        identifier: process.env.GITHUB_USER,
        token: process.env.GITHUB_TOKEN
    }), store, range);

    // weather from forecast.io
    forecast_io_getter(new ForecastIo({
        token: process.env.FORECASTIO_API_KEY
    }), store, range, {
        latitude: process.env.MY_LATITUDE,
        longitude: process.env.MY_LONGITUDE
    });
});
