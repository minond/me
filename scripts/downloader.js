'use strict';

var every = require('../src/every'),
    mongojs = require('mongojs'),
    me = mongojs('me', ['data']),
    storage = require('../src/upserts')(me.data),
    log = require('debug')('worker');

// sources
var Github = require('../src/sources/github'),
    Lastfm = require('../src/sources/lastfm'),
    weather = require('weather-js');

// getters
var get_github_data = require('../src/getters/github'),
    get_lastfm_data = require('../src/getters/lastfm'),
    get_weather_data = require('../src/getters/weather');

// returns a filter object containing { since, until } keys
// used to filter "today" in date ranges
function today () {
    var now = new Date(),
        since = new Date(now.setHours(0, 0, 0)),
        until = new Date(now.setHours(24, 0, 0));

    return {
        since: since,
        until: until
    };
}

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

// code
every(12).hours(function () {
    var github = new Github(
        process.env.GITHUB_OAUTH_USER,
        process.env.GITHUB_OAUTH_TOKEN
    );

    get_github_data(storage, github, today());
});

// songs
every(12).hours(function () {
    var lastfm = new Lastfm(
        process.env.LASTFM_USER,
        process.env.LASTFM_API_KEY
    );

    get_lastfm_data(storage, lastfm, today());
});

// weather
every.hour(function () {
    get_weather_data(storage, weather, {
        search: 'Provo, UT'
    });
});
