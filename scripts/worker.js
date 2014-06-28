'use strict';

var every = require('../src/every'),
    jobs = require('../src/jobs');

every.hour(jobs.check_mongo_connection);
every.hour(jobs.get_weather);
every(12).hours(jobs.get_code);
every(12).hours(jobs.get_songs);
every.week(jobs.get_sleep_data);
