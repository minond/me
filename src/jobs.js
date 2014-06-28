'use strict';

var mongojs = require('mongojs'),
    me = mongojs('me', ['data']),
    log = require('debug')('worker'),
    config = require('../config/getters');

// sources
var Github = require('./sources/github'),
    Lastfm = require('./sources/lastfm'),
    Csv = require('./sources/csv'),
    weather = require('weather-js');

// getters
var get_github_data = require('./getters/github'),
    get_lastfm_data = require('./getters/lastfm'),
    get_weather_data = require('./getters/weather'),
    get_sleep_cycle_data = require('./getters/sleep_cycle');

// sources
var lastfm = new Lastfm(config.lastfm.user, config.lastfm.key),
    github = new Github(config.github.user, config.github.key),
    sleep_data = new Csv(config.sleep_cycle.files, { required_columns: ['start', 'end'] });

 // adds an "upserrt" method to a collection object
(function (coll) {
    coll.upsert = (function () {
        var log = require('debug')('mongo');

        return function (entry) {
            var query = { id: entry.id() },
                options = { upsert: true },
                data = entry.json();

            coll.update(query, data, options, function (err) {
                if (!err) {
                    log('succesfully saved %s', entry.id());
                } else {
                    log('error saving %s: %s', entry.id(), err.message);
                }
            });
        };
    })();
})(me.data);

/**
 * returns a filter object containing { since, until } keys. used to filter
 * "today" in date ranges
 *
 * @function today
 * @return {Object}
 */
function today () {
    var now = new Date(),
        since = new Date(now.setHours(0, 0, 0)),
        until = new Date(now.setHours(24, 0, 0));

    return {
        since: since,
        until: until
    };
}

/**
 * check we're still connected to mongo. kill process on error
 * @function check_mongo_connection
 */
function check_mongo_connection () {
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
}

/**
 * gets code/commit data from github for the past day
 * @function get_code
 */
function get_code () {
    get_github_data(me.data, github, today());
}

/**
 * gets song data from last.fm for the past day
 * @function get_songs
 */
function get_songs () {
    get_lastfm_data(me.data, lastfm, today());
}

/**
 * gets local weather data
 * @function get_weather
 */
function get_weather () {
    get_weather_data(me.data, weather, { search: config.weather.static_location });
}

/**
 * parses csv output from my sleep cycle app
 * @function get_sleep_cycle
 */
function get_sleep_cycle () {
    get_sleep_cycle_data(me.data, sleep_data);
}

module.exports = {
    check_mongo_connection: check_mongo_connection,
    get_weather: get_weather,
    get_code: get_code,
    get_songs: get_songs,
    get_sleep_cycle: get_sleep_cycle
};
