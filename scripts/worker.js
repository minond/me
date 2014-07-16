'use strict';

var every = require('../src/every'),
    tasks = require('../src/tasks/index'),
    log = require('debug')('worker');

every.hour(function () {
    // check we're still connected to mongo. kill process on error
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

require('../config/schedule')(every, tasks);
