'use strict';

var Entry = require('../../../entry'),
    log = require('debug')('health:fat:fitbit:getter');

/**
 * @param {Object} storage
 * @param {Fitbit} fitbit
 * @param {Object} filters
 */
module.exports = function (storage, fitbit, filters) {
    var since = filters.since,
        until = filters.until;

    log('getting body fat data from fitbit from %s to %s', since, until);
    fitbit.fat(since, until).then(function (res) {
        var entry, date, suid;

        res.fat.forEach(function (log_entry) {
            date = new Date(log_entry.date + ' ' + log_entry.time);
            suid = Entry.date2suid(date);
            entry = new Entry('fat', suid, { fat: log_entry.fat });

            entry.source = 'Fitbit Aria';
            entry.dtstamp = date;
            log('saving %s', entry.id());
            storage.upsert(entry);
        });
    });
};
