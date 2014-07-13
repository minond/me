'use strict';

var getter, source, task;

var Github = require('../sources/github'),
    Fitbit = require('../sources/fitbit');

// var config = require('../../config/application'),
var config = require('../../config/getters'),
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
        config.github.user,
        config.github.key
    ),
    fitbit: new Fitbit({
        consumer_key: config.fitbit.consumer_key,
        application_secret: config.fitbit.application_secret,
        user_token: config.fitbit.user_token,
        user_secret: config.fitbit.user_secret
    })
};

// getter functions
getter = {
    action: {
        commits: {
            github: require('./action/commits/github')
        }
    },
    health: {
        steps: {
            fitbit: require('./health/steps/fitbit')
        },
        water: {
            fitbit: require('./health/water/fitbit')
        },
        weight: {
            fitbit: require('./health/weight/fitbit')
        }
    }
};

// tasks that can be scheduled/ran
task = {
    action: {
        commits: {
            github: function (filters) {
                getter.action.commits.github(storage, source.github, filters());
            }
        }
    },
    health: {
        steps: {
            fitbit: function (filters) {
                getter.health.steps.fitbit(storage, source.fitbit, filters());
            }
        },
        water: {
            fitbit: function (filters) {
                getter.health.water.fitbit(storage, source.fitbit, filters());
            }
        },
        weight: {
            fitbit: function (filters) {
                getter.health.weight.fitbit(storage, source.fitbit, filters());
            }
        }
    }
};

module.exports = {
    getter: getter,
    source: source,
    task: task
};
