'use strict';

var TMPL_USER = '1/user/-/',
    TMPL_DATE = '/date/${ date.toISOString().split("T").shift() }.json',
    TMPL_DATE_RANGE = '/date/${ since.toISOString().split("T").shift() }/' +
        '${ until.toISOString().split("T").shift() }.json';

var URL_BASE = 'https://api.fitbit.com/',
    URL_REQUEST_TOKEN = URL_BASE + 'oauth/request_token',
    URL_ACCESS_TOKEN = URL_BASE + 'oauth/access_token',
    URL_USER_PROFILE = URL_BASE + TMPL_USER + 'profile.json',
    URL_USER_ACTIVITIES = URL_BASE + TMPL_USER + 'activities' + TMPL_DATE,
    URL_USER_WEIGHT = URL_BASE + TMPL_USER + 'body/log/weight' + TMPL_DATE_RANGE,
    URL_USER_FAT = URL_BASE + TMPL_USER + 'body/log/fat' + TMPL_DATE_RANGE,
    URL_USER_WATER = URL_BASE + TMPL_USER + 'foods/log/water' + TMPL_DATE;

var FITBIT_API_VERSION = '1.0',
    FITBIT_API_SIGNATIRE_METHOD = 'HMAC-SHA1';

var Api = require('./base/api'),
    util = require('util');

/**
 * auth object should look something like this:
 * {
 *     consumer_key: process.env.FITBIT_API_KEY,
 *     application_secret: process.env.FITBIT_SECRET,
 *     user_token: process.env.FITBIT_ACCESS_TOKEN,
 *     user_secret: process.env.FITBIT_ACCESS_TOKEN_SECRET
 * }
 *
 * @link https://wiki.fitbit.com/display/API/Fitbit+Resource+Access+API
 * @constructor
 * @class Fitbit
 * @param {Object} auth
 */
function Fitbit (auth) {
    Api.call(this);

    /**
     * @property $log
     * @type {Function}
     */
    this.$log = require('debug')('fitbit:api');

    /**
     * @property $auth
     * @type {Object}
     */
    this.$auth = {
        consumer_key: auth.consumer_key,
        application_secret: auth.application_secret,
        user_token: auth.user_token,
        user_secret: auth.user_secret,
        request_token_url: URL_REQUEST_TOKEN,
        request_access_url: URL_ACCESS_TOKEN,
        api_version: FITBIT_API_VERSION,
        signature_method: FITBIT_API_SIGNATIRE_METHOD
    };
}

util.inherits(Fitbit, Api);

/**
 * @link https://wiki.fitbit.com/display/API/API-Get-User-Info
 * @method profile
 * @return {Q.Promise}
 */
Fitbit.prototype.profile = Api.request.oauth.get(URL_USER_PROFILE);

/**
 * @link https://wiki.fitbit.com/display/API/API-Get-Activities
 * @method activities
 * @param {Date} date
 * @return {Q.Promise}
 */
Fitbit.prototype.activities = Api.request.oauth.get(URL_USER_ACTIVITIES, ['date']);

/**
 * @link https://wiki.fitbit.com/display/API/API-Get-Water
 * @method water
 * @param {Date} date
 * @return {Q.Promise}
 */
Fitbit.prototype.water = Api.request.oauth.get(URL_USER_WATER, ['date']);

/**
 * @link https://wiki.fitbit.com/display/API/API-Get-Body-Weight
 * @method weight
 * @param {Date} since
 * @param {Date} until
 * @return {Q.Promise}
 */
Fitbit.prototype.weight = Api.request.oauth.get(URL_USER_WEIGHT, ['since', 'until']);

/**
 * @link https://wiki.fitbit.com/display/API/API-Get-Body-Fat
 * @method fat
 * @param {Date} since
 * @param {Date} until
 * @return {Q.Promise}
 */
Fitbit.prototype.fat = Api.request.oauth.get(URL_USER_FAT, ['since', 'until']);

module.exports = Fitbit;
