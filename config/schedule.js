'use strict';

/**
 * returns a filter object containing { since, until } keys. used to filter
 * "today" in date range
 *
 * @function date_filters
 * @return {Object}
 */
function date_filters () {
    var since = new Date(),
        until = new Date();

    since.setDate(-2);
    since.setHours(0, 0, 0);
    since.setMilliseconds(0);

    until.setHours(24, 0, 0);
    until.setMilliseconds(0);

    return {
        since: since,
        until: until
    };
}

module.exports = function (every, jobs, tasks) {
    // every.hour(jobs.get_weather);
    // every.week(jobs.get_sleep_cycle);

    /* every(12).hours(jobs.get_activities, [ date_filters ]); */
    // every(12).hours(tasks.task.health.steps.fitbit, [ date_filters ]);
    // every(12).hours(tasks.task.health.water.fitbit, [ date_filters ]);
    // every(12).hours(tasks.task.health.weight.fitbit, [ date_filters ]);

    /* every(12).hours(jobs.get_code, [ date_filters ]); */
    // every(12).hours(tasks.task.action.commits.github, [ date_filters ]);

    /* every(12).hours(jobs.get_songs, [ date_filters ]); */
    every(12).hours(tasks.task.action.songs.lastfm, [ date_filters ]);
};
