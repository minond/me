'use strict';

var getter, source, task;

var Github = require('../sources/github'),
    Lastfm = require('../sources/lastfm'),
    Fitbit = require('../sources/fitbit'),
    ForecastIo = require('../sources/forecast_io'),
    Csv = require('../sources/csv');

// var config = require('../../config/application'),
var config = require('../../config/application'),
    mongojs = require('mongojs'),
    database = mongojs(config.storage.db, [ config.storage.collection ]),
    storage = database[ config.storage.collection ];

 // adds an "upsert" method to a collection object
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
})(storage);

// api sources
source = {
    github: new Github(
        config.auth.github.user,
        config.auth.github.key
    ),
    lastfm: new Lastfm(
        config.auth.lastfm.user,
        config.auth.lastfm.key
    ),
    forecast_io: new ForecastIo(
        config.auth.forecast_io.key
    ),
    fitbit: new Fitbit({
        consumer_key: config.auth.fitbit.consumer_key,
        application_secret: config.auth.fitbit.application_secret,
        user_token: config.auth.fitbit.user_token,
        user_secret: config.auth.fitbit.user_secret
    }),
    sleep_cycle: new Csv(config.files.sleep_cycle, {
        delimiter: ';',
        required_columns: ['start', 'end']
    })
};

// getter functions
getter = {
    environment: {
        weather: {
            forecast_io: require('./environment/weather/forecast_io')
        }
    },
    action: {
        commits: {
            github: require('./action/commits/github')
        },
        songs: {
            lastfm: require('./action/songs/lastfm')
        }
    },
    health: {
        sleep: {
            sleep_cycle: require('./health/sleep/sleep_cycle')
        },
        steps: {
            fitbit: require('./health/steps/fitbit')
        },
        water: {
            fitbit: require('./health/water/fitbit')
        },
        fat: {
            fitbit: require('./health/fat/fitbit')
        },
        weight: {
            fitbit: require('./health/weight/fitbit')
        }
    }
};

// tasks that can be scheduled/ran
task = {
    environment: {
        weather: {
            forecast_io: function (filters) {
                getter.environment.weather.forecast_io(storage, source.forecast_io, filters);
            }
        }
    },
    action: {
        commits: {
            github: function (filters) {
                getter.action.commits.github(storage, source.github, filters);
            }
        },
        songs: {
            lastfm: function (filters) {
                getter.action.songs.lastfm(storage, source.lastfm, filters);
            }
        }
    },
    health: {
        sleep: {
            sleep_cycle: function (filters) {
                getter.health.sleep.sleep_cycle(storage, source.sleep_cycle, filters);
            }
        },
        steps: {
            fitbit: function (filters) {
                getter.health.steps.fitbit(storage, source.fitbit, filters);
            }
        },
        water: {
            fitbit: function (filters) {
                getter.health.water.fitbit(storage, source.fitbit, filters);
            }
        },
        fat: {
            fitbit: function (filters) {
                getter.health.fat.fitbit(storage, source.fitbit, filters);
            }
        },
        weight: {
            fitbit: function (filters) {
                getter.health.weight.fitbit(storage, source.fitbit, filters);
            }
        }
    }
};

module.exports = {
    database: database,
    storage: storage,
    getter: getter,
    source: source,
    task: task
};
