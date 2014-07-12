'use strict';

// kl to lbs
var KL2LBS = 2.2046;

var Entry = require('../../../entry'),
    log = require('debug')('health:weight:fitbit:getter');

/**
 * @param {Object} storage
 * @param {Fitbit} fitbit
 * @param {Object} filters
 */
module.exports = function (storage, fitbit, filters) {
    var date = filters.since,
        suid = Entry.date2suid(date);

    log('getting weight data from fitbit for %s', date);

    /**
     * expects res.weight. converts this into pounds
     * @param {Object} res
     */
    fitbit.profile().then(function (res) {
        var entry = new Entry('weight', suid, {
            weight: Math.ceil(res.user.weight * KL2LBS)
        });

        entry.source = 'Fitbit Aria';
        entry.dtstamp = date;
        log('saving %s', entry.id());
        storage.upsert(entry);
    });
};
