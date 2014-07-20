'use strict';

/**
 * returns a filter object containing { since, until } keys. used to filter
 * "today" in date range
 *
 * @function filters
 * @return {Object}
 */
function filters () {
    var since = new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        until = new Date();

    since.setHours(0, 0, 0);
    since.setMilliseconds(0);

    until.setHours(24, 0, 0);
    until.setMilliseconds(0);

    return [{
        since: since,
        until: until
    }];
}

module.exports = function (every, tasks) {
    every(12).hours(tasks.task.environment.weather.forecast_io, filters);
    every.week(tasks.task.health.sleep.sleep_cycle);
    every.day(tasks.task.health.steps.fitbit, filters);
    every.day(tasks.task.health.water.fitbit, filters);
    every.day(tasks.task.health.weight.fitbit, filters);
    every.day(tasks.task.health.fat.fitbit, filters);
    every(12).hours(tasks.task.action.commits.github, filters);
    every(12).hours(tasks.task.action.songs.lastfm, filters);
};
