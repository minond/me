'use strict';

var mongojs = require('mongojs'),
    me = mongojs('me', ['data']),
    storage = require('./upserts')(me.data),
    log = require('debug')('worker');

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

// api connections
var lastfm = new Lastfm(process.env.LASTFM_USER, process.env.LASTFM_API_KEY),
    github = new Github(process.env.GITHUB_OAUTH_USER, process.env.GITHUB_OAUTH_TOKEN),
    sleep_data = new Csv('/home/marcos/Downloads/sleepdata*', { required_columns: ['start', 'end'] });

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
    get_github_data(storage, github, today());
}

/**
 * gets song data from last.fm for the past day
 * @function get_songs
 */
function get_songs () {
    get_lastfm_data(storage, lastfm, today());
}

/**
 * gets local weather data
 * @function get_weather
 */
function get_weather () {
    get_weather_data(storage, weather, { search: 'Provo, UT' });
}

/**
 * parses csv output from my sleep cycle app
 * @function parse_sleep_data
 */
function get_sleep_data () {
    get_sleep_cycle_data(storage, sleep_data);
}

module.exports = {
    check_mongo_connection: check_mongo_connection,
    get_weather: get_weather,
    get_code: get_code,
    get_songs: get_songs,
    get_sleep_data: get_sleep_data
};
