'use strict';

var Q = require('q'),
    glob = require('glob'),
    fs = require('fs'),
    log = require('debug')('text:file');

/**
 * @constructor
 * @class File
 * @param {string} fpattern file pattern
 */
function File (fpattern) {
    /**
     * file search pattern
     * @property fpattern
     * @type {string}
     */
    this.fpattern = fpattern;
}

/**
 * @method files
 * @return {Q.Promise}
 */
File.prototype.files = function () {
    log('searching for %s', this.fpattern);
    return Q.nfcall(glob, this.fpattern);
};

/**
 * @method contents
 * @return {Q.Promise}
 */
File.prototype.contents = function () {
    var deferred = Q.defer(),
        buffers = [],
        fcount = 0;

    this.files().then(function (files) {
        files.forEach(function (file) {
            log('reading %s', file);
            fs.readFile(file, function (err, data) {
                fcount++;

                if (err) {
                    log('error reading %s: %s', file, err.message);
                    deferred.reject(err);
                    return;
                }

                buffers[ files.indexOf(file) ] = data;

                if (fcount === files.length) {
                    deferred.resolve(buffers);
                }
            });
        });
    });

    return deferred.promise;
};

module.exports = File;
