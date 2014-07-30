'use strict';

var Entry = require('../src/entry');

var every = require('../src/every'),
    tasks = require('../src/tasks/index'),
    lodash = require('lodash'),
    log = require('debug')('worker');

// check we're still connected to mongo. kill process on error
every.hour(function () {
    log('checking mongo stats');
    tasks.database.stats(function (err, stats) {
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

every(5).minutes(function () {
    log('fetching entry counts');
    lodash.each(Entry.schema.labels, function (type, label) {
        tasks.storage.count({ label: label, type: type }, function (err, count) {
            if (err) {
                log('error getting count for %s (%s)', label, type);
            } else {
                log('%s (%s): %s', label, type, count);
            }
        });
    });
});

require('../config/schedule')(every, tasks);
