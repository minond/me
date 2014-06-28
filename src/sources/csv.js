'use strict';

var Q = require('q'),
    lodash = require('lodash'),
    glob = require('glob'),
    csv = require('csv'),
    fs = require('fs'),
    log = require('debug')('csv:file');

/**
 * extra trimming?
 *
 * @function csv_parse_option_trim
 * @param {Array} rows
 * @return {Array}
 */
function csv_parse_option_trim (rows) {
    return rows.forEach(function (row) {
        lodash(row).each(function (val, key) {
            row[ key ] = val.toString().trim();
        });
    });
}

/**
 * custom option
 * normalize_columns:
 * Start => start, Sleep Notes => sleep_notes
 *
 * @function csv_parse_option_normalize_columns
 * @param {Array} rows
 * @return {Array}
 */
function csv_parse_option_normalize_columns (rows) {
    return rows.forEach(function (row) {
        lodash(row).each(function (val, key) {
            var normalized = key
                .toLowerCase()
                .replace(/\s+/g, '_')
                .replace(/\W+/g, '');

            delete row[ key ];
            row[ normalized ] = val;
        });
    });
}

/**
 * custom option
 * required_columns:
 * rows missing values in required columns are removed
 *
 * @function csv_parse_option_required_columns
 * @param {Array} rows
 * @param {Array} required_columns
 * @return {Array}
 */
function csv_parse_option_required_columns (rows, required_columns) {
    var valid, clean = [];

    rows.forEach(function (row) {
        valid = true;

        required_columns.forEach(function (col) {
            if (!(col in row) || !row[ col ]) {
                valid = false;
            }
        });

        if (valid) {
            clean.push(row);
        }
    });

    rows = clean;
    return rows;
}

/**
 * @constructor
 * @class Csv
 * @param {string} fpattern file pattern
 * @param {Object} [options]
 */
function Csv (fpattern, options) {
    this.fpattern = fpattern;
    this.csv_parse_options = lodash.defaults(options || {}, {
        delimiter: ';',
        columns: true,
        normalize_columns: true,
        required_columns: [],
        skip_empty_lines: true,
        trim: true
    });
}

/**
 * @method rows
 * @return {Q.Promise}
 */
Csv.prototype.rows = function () {
    var deferred = Q.defer(),
        csv_parse_options = this.csv_parse_options;

    log('looking for files matching %s pattern', this.fpattern);
    glob(this.fpattern, function (err, files) {
        if (err) {
            log('error: %s', err.message);
            deferred.reject(err);
            return;
        }

        files.forEach(function (file) {
            log('reading %s', file);

            fs.readFile(file, function (err, data) {
                if (err) {
                    log('error reading %s: %s', file, err.message);
                    deferred.reject(err);
                    return;
                }

                csv.parse(data, csv_parse_options, function (err, rows) {
                    if (err) {
                        log('error parsing %s: %s', file, err.message);
                        deferred.reject(err);
                        return;
                    }

                    if (csv_parse_options.trim) {
                        csv_parse_option_trim(rows);
                    }

                    if (csv_parse_options.normalize_columns) {
                        csv_parse_option_normalize_columns(rows);
                    }

                    if (csv_parse_options.required_columns.length) {
                        rows = csv_parse_option_required_columns(rows, csv_parse_options.required_columns);
                    }

                    deferred.resolve(rows);
                });
            });
        });
    });

    return deferred.promise;
};

module.exports = Csv;
