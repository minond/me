'use strict';

var SECOND = 1000,
    MINUTE = SECOND * 60,
    HOUR = MINUTE * 60,
    DAY = HOUR * 24;

/**
 * generates a repeater function
 *
 * @function repeat
 * @param {int} timeout
 * @return {Function}
 */
function repeat (timeout) {
    return function run (action) {
        action();
        setTimeout(function () {
            run(action);
        }, timeout);
    };
}

/**
 * @example
 *     every(10).seconds(do_something);
 *     every.day(do_something_else);
 *
 * @function every
 * @param {int} increment
 * @return {Object}
 */
module.exports = function every (inc) {
    inc = inc || 1;

    return {
        seconds: repeat(inc * SECOND),
        minutes: repeat(inc * MINUTE),
        hours: repeat(inc * HOUR),
        days: repeat(inc * DAY)
    };
};

module.exports.second = repeat(SECOND);
module.exports.minute = repeat(MINUTE);
module.exports.hour = repeat(HOUR);
module.exports.day = repeat(DAY);
