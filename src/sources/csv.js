'use strict';

var File = require('./base/file');

var Q = require('q'),
    lodash = require('lodash'),
    util = require('util'),
    csv = require('csv'),
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

            if (normalized) {
                row[ normalized ] = val;
            }
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
    File.call(this, fpattern);

    /**
     * options for parsing csv string
     * @property csv_parse_options
     * @type {Object}
     */
    this.csv_parse_options = lodash.defaults(options || {}, {
        ignore_lines: 0,
        columns: true,
        normalize_columns: true,
        required_columns: [],
        skip_empty_lines: true,
        trim: true
    });
}

util.inherits(Csv, File);

/**
 * @method rows
 * @return {Q.Promise}
 */
Csv.prototype.rows = function () {
    var deferred = Q.defer(),
        csv_parse_options = this.csv_parse_options;

    this.contents().then(function (contents) {
        contents.forEach(function (data) {
            data = data
                .toString()
                .split('\n')
                .splice(csv_parse_options.ignore_lines)
                .join('\n');

            log('parsing csv file');
            csv.parse(data, csv_parse_options, function (err, rows) {
                if (err) {
                    log('error parsing file: %s', err.message);
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

    return deferred.promise;
};

module.exports = Csv;
