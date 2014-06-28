'use strict';

var URL_BASE = 'https://api.fitbit.com/',
    URL_REQUEST_TOKEN = URL_BASE + 'oauth/request_token',
    URL_ACCESS_TOKEN = URL_BASE + 'oauth/access_token',
    URL_USER_PROFILE = URL_BASE + '1/user/-/profile.json',
    URL_USER_ACTIVITIES = URL_BASE + '1/user/-/activities/date/' +
        '${ date.getFullYear() }-' +
        '${ date.getMonth() + 1 }-' +
        '${ date.getDate() }.json';

var FITBIT_API_VERSION = '1.0',
    FITBIT_API_SIGNATIRE_METHOD = 'HMAC-SHA1';

var OAuth = require('oauth').OAuth,
    lodash = require('lodash'),
    Q = require('q');

/**
 * generates an api call method
 *
 * @function api_request
 * @parma {string} url the end point (not including the base)
 * @param {Array} [arglist] optional arguments passed into the method and req
 * @return {Function}
 */
function api_request (url, arglist) {
    arglist = arglist || [];

    function fields (args) {
        var data = {};

        lodash.each(args, function (val, index) {
            data[ arglist[ index ] ] = val;
        });

        return data;
    }

    return function () {
        var deferred = Q.defer();

        function complete (err, data, res) {
            if (err) {
                deferred.reject(err);
                return;
            }

            deferred.resolve(JSON.parse(data));
        }

        this.$oauth.get(
            lodash.template(url, fields(arguments)),
            this.$auth.user_token,
            this.$auth.user_secret,
            complete
        );

        return deferred.promise;
    };
}

/**
 * auth object should look something like this:
 * {
 *     consumer_key: process.env.FITBIT_API_KEY,
 *     application_secret: process.env.FITBIT_SECRET,
 *     user_token: process.env.FITBIT_ACCESS_TOKEN,
 *     user_secret: process.env.FITBIT_ACCESS_TOKEN_SECRET
 * }
 *
 * @constructor
 * @class Fitbit
 * @param {Object} auth
 */
function Fitbit (auth) {
    /**
     * @property $auth
     * @type {Object}
     */
    this.$auth = auth;

    /**
     * @property $oauth
     * @type {OAuth}
     */
    this.$oauth = new OAuth(
        URL_REQUEST_TOKEN,
        URL_ACCESS_TOKEN,
        this.$auth.consumer_key,
        this.$auth.application_secret,
        FITBIT_API_VERSION,
        null,
        FITBIT_API_SIGNATIRE_METHOD
    );
}

/**
 * @link https://wiki.fitbit.com/display/API/API-Get-User-Info
 * @method profile
 * @return {Q.Promise}
 */
Fitbit.prototype.profile = api_request(URL_USER_PROFILE);

/**
 * @link https://wiki.fitbit.com/display/API/API-Get-Activities
 * @method activities
 * @param {Date} date
 * @return {Q.Promise}
 */
Fitbit.prototype.activities = api_request(URL_USER_ACTIVITIES, ['date']);

module.exports = Fitbit;
