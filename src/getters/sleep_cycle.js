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
        //     sleep_quality: '73%',
        //     time_in_bed: '6:40',
        //     wake_up: '',
        //     sleep_notes: 'Drank coffee:Drank tea:Stressful day',
        //     heart_rate: '',
        //     activity_steps: '0'
        // }
        rows.forEach(function (row) {
            var entry, start, end, quality, time, suid;

            start = new Date(row.start);
            end = new Date(row.end);
            suid = [ +start, +end ].join('');

            // quality % to time
            quality = parseInt(row.sleep_quality);

            // time hh:mm to seconds
            time = row.time_in_bed.split(':');
            time = (parseInt(time[0]) * 60 * 60) +
                (parseInt(time[1]) * 60);

            entry = new Entry('sleep', suid, {
                start: start,
                end: end,
                time_human: row.time_in_bed,
                time: time,
                quality: quality,
                notes: row.sleep_notes
                    .toLowerCase()
                    .split(':'),
            });

            entry.source = 'Sleep Cycle App';
            entry.dtstamp = end;
            log('saving %s', entry.id());
            storage.upsert(entry);
        });
    });
};
