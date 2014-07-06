'use strict';

var Q = require('q'),
    OAuth = require('oauth').OAuth,
    lodash = require('lodash');

/**
 * returns a function that joins a list of buffers, json decodes that, then
 * resolves a Q promise with that object
 *
 * @function resolve
 * @param {Q.deferred} deferred
 * @param {Array} buffers
 * @param {Function} log
 * @return {Function}
 */
function resolve (deferred, buffers, log) {
    return function () {
        var joined = JSON.parse(buffers.join(''));
        log('resolving request');
        deferred.resolve(joined);
    };
}

/**
 * returns a function that is used to resolve completed requests
 *
 * @function complete
 * @param {Q.deferred} deferred
 * @param {Function} log
 * @return {Function}
 */
function complete (deferred, log) {
    return function (err, data) {
        if (err) {
            log('reject request');
            deferred.reject(err);
        } else {
            log('resolving request');
            deferred.resolve(JSON.parse(data));
        }
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
 * @function http_request
 * @param {string} url the end point (not including the base)
 * @param {Array} arglist arguments passed into the method and req
 * @param {Object} proxy client used to make request
 * @return {Function}
 */
function http_request (method, url, arglist, proxy) {
    return function () {
        var deferred = Q.defer(),
            options = this.$options(url, params(arglist, arguments)),
            log = this.$log;

        log('requesting %s', options.path);
        proxy[ method ](options, function (res) {
            var buffers = [];

            log('downloading %s', options.path);
            res.on('data', buffers.push.bind(buffers));
            res.on('end', resolve(deferred, buffers, log));
        }).on('error', function (err) {
            log('error getting %s', options.path);
            deferred.reject(err);
        });

        return deferred.promise;
    };
}

/**
 * generates an oauth api call method
 *
 * @function oauth_request
 * @param {string} url the end point (not including the base)
 * @param {Array} arglist arguments passed into the method and req
 * @param {Object} proxy client used to make request
 * @return {Function}
 */
function oauth_request (method, url, arglist, proxy) {
    return function () {
        var deferred = Q.defer();

        if (!this.$oauth) {
            this.$oauth = new OAuth(
                this.$auth.request_token_url,
                this.$auth.request_access_url,
                this.$auth.consumer_key,
                this.$auth.application_secret,
                this.$auth.api_version,
                null,
                this.$auth.signature_method
            );
        }

        this.$log('requesting %s', lodash.template(url, params(arglist, arguments)));
        this.$oauth.get(
            lodash.template(url, params(arglist, arguments)),
            this.$auth.user_token,
            this.$auth.user_secret,
            complete(deferred, this.$log)
        );

        return deferred.promise;
    };
}

/**
 * @constructor
 * @class Api
 */
function Api () {
    /**
     * @property $oauth
     * @type {OAuth}
     */
    this.$oauth = null;

    /**
     * @property $log
     * @type {Function}
     */
    this.$log = require('debug')('base:api');
}

/**
 * api request function generators
 * @property request
 * @type {Object}
 */
Api.request = {
    http: {},
    https: {},
    oauth: {}
};

/**
 * generates an api call method using http
 *
 * @method request.http.get
 * @static
 * @param {string} url the end point (not including the base)
 * @param {Array} [arglist] optional arguments passed into the method and req
 * @return {Function}
 */
Api.request.http.get = function (url, arglist) {
    return http_request('get', url, arglist, require('http'));
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
Api.request.https.get = function (url, arglist) {
    return http_request('get', url, arglist, require('https'));
};

/**
 * generates an api call method using oauth
 *
 * @method request.oauth
 * @parma {string} url the end point (not including the base)
 * @param {Array} [arglist] optional arguments passed into the method and req
 * @return {Function}
 */
Api.request.oauth.get = function (url, arglist) {
    return oauth_request('get', url, arglist, this.$oauth);
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
