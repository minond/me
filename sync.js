'use strict';

var MongoClient = require('mongodb').MongoClient,
    ForecastIo = require('aping/client/forecast_io'),
    Lastfm = require('aping/client/lastfm'),
    Github = require('aping/client/github');

var moment = require('moment-range'),
    argv = require('minimist')(process.argv.slice(2), {string: ['since', 'until']}),
    config = require('acm'),
    forIn = require('lodash-node/modern/objects/forIn'),
    connect = require('./src/store');

var forecast_io_getter = require('./src/getters/environment/weather/forecast_io'),
    lastfm_getter = require('./src/getters/action/songs/lastfm'),
    github_getter = require('./src/getters/action/commits/github');

var since = new Date(argv.since || Date.now()),
    until = new Date(argv.until || Date.now()),
    range = moment().range(since, until);

connect(MongoClient, config).then(function (store) {
    forIn(config.get('users'), function (sources, user) {
        forIn(sources, function (config, source) {
            switch (source) {
                case 'github':
                    github_getter(new Github({
                        identifier: process.env.GITHUB_USER,
                        token: process.env.GITHUB_TOKEN
                    }), store, range);
                    break;

                case 'forecast_io':
                    forecast_io_getter(new ForecastIo({
                        token: process.env.FORECASTIO_API_KEY
                    }), store, range, {
                        latitude: process.env.MY_LATITUDE,
                        longitude: process.env.MY_LONGITUDE
                    });
                    break;

                case 'lastfm':
                    lastfm_getter(new Lastfm({
                        identifier: process.env.LASTFM_USER,
                        token: process.env.LASTFM_API_KEY
                    }), store, range);
                    break;

                default:
                    throw new Error('invalid source: ' + source + ' for ' + user);
                    break;
            }
        });
    });
});
