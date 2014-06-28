module.exports = function (every, jobs) {
    every.hour(jobs.get_weather);
    every(12).hours(jobs.get_code);
    every(12).hours(jobs.get_songs);
    every.week(jobs.get_sleep_cycle);
};
