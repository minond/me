'use strict';

var every = require('../src/every'),
    tasks = require('../src/tasks/index'),
    jobs = require('../src/jobs');

every.hour(jobs.check_mongo_connection);
require('../config/schedule')(every, jobs, tasks);
