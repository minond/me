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
    var since = filters.since,
        until = filters.until;

    log('getting weight data from fitbit from %s to %s', since, until);
    fitbit.weight(since, until).then(function (res) {
        var entry, date, suid;

        res.weight.forEach(function (log_entry) {
            date = new Date(log_entry.date + ' ' + log_entry.time);
            suid = Entry.date2suid(date);
            entry = new Entry('weight', suid, {
                weight: Math.ceil(log_entry.weight * KL2LBS),
                bmi: log_entry.bmi
            });

            entry.source = 'Fitbit Aria';
            entry.dtstamp = date;
            log('saving %s', entry.id());
            storage.upsert(entry);
        });
    });
};
