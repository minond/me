'use strict';

/**
 * returns a filter object containing { since, until } keys. used to filter
 * "today" in date range
 *
 * @function date_filters
 * @return {Object}
 */
function date_filters () {
    var since = new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        until = new Date();

    since.setHours(0, 0, 0);
    since.setMilliseconds(0);

    until.setHours(24, 0, 0);
    until.setMilliseconds(0);

    return {
        since: since,
        until: until
    };
}

module.exports = function (every, tasks) {
    every(12).hours(tasks.task.environment.weather.forecast_io, [ date_filters ]);
    every.week(tasks.task.health.sleep.sleep_cycle);
    every.day(tasks.task.health.steps.fitbit, [ date_filters ]);
    every.day(tasks.task.health.water.fitbit, [ date_filters ]);
    every.day(tasks.task.health.weight.fitbit, [ date_filters ]);
    every(12).hours(tasks.task.action.commits.github, [ date_filters ]);
    every(12).hours(tasks.task.action.songs.lastfm, [ date_filters ]);
};
