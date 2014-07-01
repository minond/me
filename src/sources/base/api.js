'use strict';

var Q = require('q'),
    lodash = require('lodash');

/**
 * returns a function that joins a list of buffers, json decodes that, then
 * resolves a Q promise with that object
 *
 * @function resolve
 * @param {Q.deferred} deferred
 * @param {Array} buffers
 * @return {Function}
 */
function resolve (deferred, buffers) {
    return function () {
        var joined = JSON.parse(buffers.join(''));
        deferred.resolve(joined);
    };
}

/**
 * @constructor
 * @class Api
 */
function Api () {
    /**
     * @property $proxy
     * @type {Object}
     */
    this.$proxy = require('https');
}

/**
 * generates an api call method
 *
 * @method request
 * @static
 * @param {string} url the end point (not including the base)
 * @param {Array} [arglist] optional arguments passed into the method and req
 * @return {Function}
 */
Api.request = function (url, arglist) {
    arglist = arglist || [];

    function fields (args) {
        var data = {};

        lodash.each(args, function (val, index) {
            data[ arglist[ index ] ] = val;
        });

        return data;
    }

    return function () {
        var deferred = Q.defer(),
            options = this.$options(url, fields(arguments)),
            log = this.$log;

        log('requesting %s', options.path);
        this.$proxy.get(options, function (res) {
            var buffers = [];

            log('downloading %s', options.path);
            res.on('data', buffers.push.bind(buffers));
            res.on('end', resolve(deferred, buffers));
        }).on('error', function (err) {
            log('error getting %s', options.path);
            deferred.reject(err);
        });

        return deferred.promise;
    };
};

/**
 * generates a request options object
 *
 * @method $options
 * @param {string} path url path. can be a lodash template string
 * @param {Object} [fields]
 * @return {Object}
 */
Api.prototype.$options = function (path, fields) {
    return {};
};

module.exports = Api;
