'use strict';

var Entry = require('../entry'),
    log = require('debug')('sleep_cycle:getter');

/**
 * @function get_sleep_cycle_data
 * @param {Object} storage
 * @param {Csv} sleep_data
 */
module.exports = function get_sleep_cycle_data (storage, sleep_data) {
    sleep_data.rows().then(function (rows) {
        // {
        //     start: '2014-03-14 00:43:59',
        //     end: '2014-03-14 07:24:42',
        //     Sleep_quality: '73%',
        //     time_in_bed: '6:40',
        //     wake_up: '',
        //     sleep_notes: 'Drank coffee:Drank tea:Stressful day',
        //     heart_rate: '',
        //     activity_steps: '0'
        // }
        rows.forEach(function (row) {
            var entry, start, end, suid;

            start = new Date(row.start);
            end = new Date(row.end);
            suid = [ +start, +end ].join('');

            entry = new Entry('sleep', suid, {
                start: start,
                end: end,
                time: row.time_in_bed,
                notes: row.sleep_notes
                    .toLowerCase()
                    .split(':'),
            });

            entry.dtstamp = end;
            log('saving %s', entry.id());
            storage.upsert(entry);
        });
    });
};
