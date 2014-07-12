'use strict';

// milliliters to fluid ounces
var ML2FL = 29.57;

var Entry = require('../../../entry'),
    log = require('debug')('health:water:fitbit:getter');

/**
 * @function get_fitbit_data
 * @param {Object} storage
 * @param {Fitbit} fitbit
 * @param {Object} filters
 */
module.exports = function (storage, fitbit, filters) {
    var date = filters.since,
        suid = Entry.date2suid(date);

    log('getting water data from fitbit for %s', date);

    /**
     * values are in milliliters
     * @example res
     *     {
     *         summary: {
     *             water: 2392.5
     *         },
     *         water: [
     *             { amount: 499.79998779296875, logId: 404295773 },
     *             { amount: 118.30000305175781, logId: 404481832 },
     *             { amount: 591.5, logId: 404561705 },
     *             { amount: 591.5, logId: 404699366 },
     *             { amount: 591.5, logId: 404767731 }
     *         ]
     *     }
     *
     * handles response from fitbit.water call
     * @param {Object} res
     */
    fitbit.water(date).then(function (res) {
        var entry = new Entry('water', suid, {
            fl: Math.round(res.summary.water / ML2FL * 100) / 100
        });

        entry.source = 'Fitbit App';
        entry.dtstamp = date;
        log('saving %s', entry.id());
        storage.upsert(entry);
    });
};
