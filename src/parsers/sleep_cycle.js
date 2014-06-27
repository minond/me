'use strict';

var Entry = require('../entry'),
    glob = require('glob'),
    csv = require('csv'),
    fs = require('fs'),
    log = require('debug')('sleep_cycle:parser');

/**
 * @function parse_sleep_cycle_data
 * @param {Object} storage
 * @param {string} pattern
 */
module.exports = function parse_sleep_cycle_data (storage, pattern) {
    var parse_options = {
        delimiter: ';',
        columns: true,
        skip_empty_lines: true,
        trim: true
    };

    log('looking for files matching %s pattern', pattern);
    glob(pattern, function (err, files) {
        if (err) {
            log('error: %s', err.message);
            return;
        }

        files.forEach(function (file) {
            log('reading %s', file);
            fs.readFile(file, function (err, data) {
                if (err) {
                    log('error reading %s: %s', file, err.message);
                    return;
                }

                csv.parse(data, parse_options, function (err, rows) {
                    if (err) {
                        log('error parsing %s: %s', file, err.message);
                        return;
                    }

                    // sample row:
                    // { Start: '\n2014-03-14 00:43:59',
                    //   End: '2014-03-14 07:24:42',
                    //   'Sleep quality': '73%',
                    //   'Time in bed': '6:40',
                    //   'Wake up': '',
                    //   'Sleep Notes': 'Drank coffee:Drank tea:Stressful day',
                    //   'Heart rate': '',
                    //   'Activity (steps)': '0' },
                    rows.forEach(function (row) {
                        var start, end, time, notes, suid;
                        var entry;

                        if (!('Start' in row) || !('End' in row)) {
                            // empty row
                            return;
                        }

                        start = new Date(row['Start']);
                        end = new Date(row['End']);
                        time = row['Time in bed'];
                        notes = row['Sleep Notes'].toLowerCase().split(':');
                        suid = start.valueOf().toString() + end.valueOf().toString();

                        entry = new Entry('sleep', suid, {
                            start: start,
                            end: end,
                            time: time
                        });

                        entry.dtstamp = start;
                        log('saving %s', entry.id());
                        storage.upsert(entry);
                    });
                });
            });
        });
    });
};
