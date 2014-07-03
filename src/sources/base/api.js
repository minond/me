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
 * generates parameters for request functions
 * @function params
 * @param {Array} arglist expected arguments (ie. date, page, username, etc.)
 * @param {Array} args parameters passed to function
 * @return {Object}
 */
function params (arglist, args) {
    var data = {};

    lodash.each(arglist, function (val, index) {
        data[ val ] = args[ index ];
    });

    return data;
}

/**
 * generates an api call method
 *
 * @function get
 * @param {string} url the end point (not including the base)
 * @param {Array} arglist arguments passed into the method and req
 * @param {Object} proxy client used to make request
 * @return {Function}
 */
function get (url, arglist, proxy) {
    return function () {
        var deferred = Q.defer(),
            options = this.$options(url, params(arglist, arguments)),
            log = this.$log;

        log('requesting %s', options.path);
        proxy.get(options, function (res) {
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
}

/**
 * @constructor
 * @class Api
 */
function Api () {
}

/**
 * api request function generators
 * @property request
 * @type {Object}
 */
Api.request = {};

/**
 * generates an api call method using http
 *
 * @method request.http
 * @static
 * @param {string} url the end point (not including the base)
 * @param {Array} [arglist] optional arguments passed into the method and req
 * @return {Function}
 */
Api.request.http = function (url, arglist) {
    return get(url, arglist, require('http'));
};

/**
 * generates an api call method using https
 *
 * @method request.https
 * @static
 * @param {string} url the end point (not including the base)
 * @param {Array} [arglist] optional arguments passed into the method and req
 * @return {Function}
 */
Api.request.https = function (url, arglist) {
    return get(url, arglist, require('https'));
};

/**
 * generates a request options object
 *
 * @method $options
 * @param {string} path url path. can be a lodash template string
 * @param {Object} [fields]
 * @return {Object}
 */
Api.prototype.$options = function () {
    throw new Error('Method not implemented');
};

module.exports = Api;
