'use strict';

var Entry = require('../entry'),
    log = require('debug')('fitbit:getter');

/**
 * @function get_fitbit_data
 * @param {Object} storage
 * @param {Fitbit} fitbit
 * @param {Object} filters
 */
module.exports = function get_fitbit_data (storage, fitbit, filters) {
    var date = filters.since,
        suid = [
            date.getFullYear(),
            date.getMonth(),
            date.getFullYear(),
            date.getDate(),
            date.getFullYear()
        ].join('');

    /**
     * res.summary should look like this:
     * {
     *     activeScore: -1,
     *     activityCalories: 747,
     *     caloriesBMR: 1775,
     *     caloriesOut: 2285,
     *     distances: [
     *         { activity: 'total', distance: 2.11 },
     *         { activity: 'tracker', distance: 2.11 },
     *         { activity: 'loggedActivities', distance: 0 },
     *         { activity: 'veryActive', distance: 0.11 },
     *         { activity: 'moderatelyActive', distance: 1.6 },
     *         { activity: 'lightlyActive', distance: 0.39 },
     *         { activity: 'sedentaryActive', distance: 0.01 }
     *     ],
     *     elevation: 27.43,
     *     fairlyActiveMinutes: 65,
     *     floors: 9,
     *     lightlyActiveMinutes: 125,
     *     marginalCalories: 447,
     *     sedentaryMinutes: 1226,
     *     steps: 2738,
     *     veryActiveMinutes: 2
     * }
     *
     * @function parse_activies
     * handles response from fitbit.activities call
     * @param {Object} res
     */
    function parse_activies (res) {
        var entry = new Entry('steps', suid, {
            score: res.summary.activeScore,
            steps: res.summary.steps,

            activity_calories: res.summary.activityCalories,
            marginal_calories: res.summary.marginalCalories,
            calories_bmr: res.summary.caloriesBMR,
            calories_out: res.summary.caloriesOut,

            minutes: {
                fairly_active: res.summary.fairlyActiveMinutes,
                lightly_active: res.summary.lightlyActiveMinutes,
                sedentary: res.summary.sedentaryMinutes,
                very_active: res.summary.veryActiveMinutes
            }
        });

        entry.dtstamp = date;
        log('saving %s', entry.id());
        storage.upsert(entry);
    }

    /**
     * expects res.weight. converts this into pounds
     * @funciton parse_profile
     * @param {Object} res
     */
    function parse_profile (res) {
        var entry = new Entry('weight', suid, {
            weight: Math.ceil(res.user.weight * 2.2046)
        });

        entry.dtstamp = date;
        log('saving %s', entry.id());
        storage.upsert(entry);
    }

    log('getting health data for %s', date);
    fitbit.activities(date).then(parse_activies);
    fitbit.profile().then(parse_profile);
};
