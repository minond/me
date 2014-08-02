'use strict';

var REFRESH_TOKEN_GRANT_TYPE = 'refresh_token';

var TMPL_DATE = function (name) {
        return '${ ' + name + '.toISOString()' +
            '.split("T")' +
            '.shift()' +
        ' }';
    };

var TMPL_DATE_RANGE = 'from=' + TMPL_DATE('since') +
        '&to=' + TMPL_DATE('until');

var URL_API_BASE = '/api/1.1/',
    URL_PLACES = URL_API_BASE + 'user/places/daily?' + TMPL_DATE_RANGE,
    URL_SUMMARY = URL_API_BASE + 'user/summary/daily?' + TMPL_DATE_RANGE,
    URL_STORYLINE = URL_API_BASE + 'user/storyline/daily?' + TMPL_DATE_RANGE;

var URL_REFRESH_TOKEN_BASE = 'api.moves-app.com',
    URL_REFRESH_TOKEN_PATH = '/oauth/v1/access_token',
    URL_BASE = 'api.moves-app.com';

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
 * @link https://dev.moves-app.com/
 * @class MovesApp
 * @extends Api
 * @param {Object} auth
 */
function MovesApp (auth) {
    Api.call(this);

    /**
     * @property $log
     * @type {Function}
     */
    this.$log = require('debug')('moves_app:api');

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
        expires_in: new Date(auth.expires_in),
        access_token: auth.access_token,
        consumer_key: auth.consumer_key,
        application_secret: auth.application_secret,
        refresh_token: auth.refresh_token,
        refresh_token_url_base: URL_REFRESH_TOKEN_BASE,
        refresh_token_url_path: URL_REFRESH_TOKEN_PATH
    };
}

util.inherits(MovesApp, Api);

/**
 * generates a request options object for a refresh token request
 *
 * @method $refresh
 * @return {Object}
 */
MovesApp.prototype.$refresh = function () {
    return {
        grant_type: REFRESH_TOKEN_GRANT_TYPE,
        client_id: this.$auth.consumer_key,
        refresh_token: this.$auth.refresh_token,
        code: this.$auth.refresh_token,
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
MovesApp.prototype.$options = function (path, fields) {
    fields = lodash.defaults(fields || {}, {
        access_token: this.$auth.access_token,
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

/**
 * @link https://dev.moves-app.com/docs/api_places
 * @method places
 * @param {Date} since
 * @param {Date} until
 * @return {Q.Promise}
 */
MovesApp.prototype.places = Api.request.oauth2.get(URL_PLACES, ['since', 'until']);

/**
 * @link https://dev.moves-app.com/docs/v1/api_summaries
 * @method summary
 * @param {Date} since
 * @param {Date} until
 * @return {Q.Promise}
 */
MovesApp.prototype.summary = Api.request.oauth2.get(URL_SUMMARY, ['since', 'until']);

/**
 * @link https://dev.moves-app.com/docs/api_storyline
 *@method storyline
 * @param {Date} since
 * @param {Date} until
 * @return {Q.Promise}
 */
MovesApp.prototype.storyline = Api.request.oauth2.get(URL_STORYLINE, ['since', 'until']);

module.exports = MovesApp;
