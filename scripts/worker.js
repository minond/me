'use strict';

var every = require('../src/every'),
    jobs = require('../src/jobs');

every.hour(jobs.check_mongo_connection);
require('../config/schedule')(every, jobs);
