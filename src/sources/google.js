'use strict';

var REFRESH_TOKEN_GRANT_TYPE = 'refresh_token';

var URL_REFRESH_TOKEN_BASE = 'accounts.google.com',
    URL_REFRESH_TOKEN_PATH = '/o/oauth2/token',
    URL_BASE = 'www.googleapis.com';

var Api = require('./base/api'),
    lodash = require('lodash'),
    util = require('util');

/**
 * auth object should look something like this:
 * {
 *     consumer_key: process.env.GOOGLE_CLIENT_ID,
 *     application_secret: process.env.GOOGLE_SECRET,
 *     refresh_token: process.env.GOOGLE_REFRESH_TOKEN
 * }
 *
 * @link https://console.developers.google.com/project
 * @class Google
 * @extends Api
 * @param {Object} auth
 */
function Google (auth) {
    Api.call(this);

    /**
     * @property $log
     * @type {Function}
     */
    this.$log = require('debug')('google:api');

    /**
     * since goole's apis tend to have a lot of parameters that are shared
     * accross different apis, I'm adding a standard $args proprty where
     * url parameters can be hard-coded and static when using the `args` merge
     * field in urls
     *
     * @property $args
     * @type {Object}
     */
    this.$args = {};

    /**
     * @property $auth
     * @type {Object}
     */
    this.$auth = {
        expires_in: Date.now(),
        consumer_key: auth.consumer_key,
        application_secret: auth.application_secret,
        refresh_token: auth.refresh_token,
        refresh_token_url_base: URL_REFRESH_TOKEN_BASE,
        refresh_token_url_path: URL_REFRESH_TOKEN_PATH
    };
}

util.inherits(Google, Api);

/**
 * generates a request options object for a refresh token request
 *
 * @method $refresh
 * @return {Object}
 */
Google.prototype.$refresh = function () {
    return {
        grant_type: REFRESH_TOKEN_GRANT_TYPE,
        client_id: this.$auth.consumer_key,
        refresh_token: this.$auth.refresh_token,
        client_secret: this.$auth.application_secret
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
Google.prototype.$options = function (path, fields) {
    fields = lodash.defaults(fields || {}, {
        args: lodash.defaults(fields.args || {}, this.$args)
    });

    return {
        host: URL_BASE,
        path: lodash.template(path, fields),
        headers: {
            Authorization: 'Bearer ' + this.$auth.access_token
        }
    };
};

module.exports = Google;
require('./google/calendar');
