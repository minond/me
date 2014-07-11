'use strict';

var URL_ACTIVITIES = '/youtube/v3/activities?' +
    'pageToken=${ args.page }&' +
    'part=${ args.part }&' +
    'mine=${ args.mine }&' +
    '<% if (args.since) { %>publishedAfter=${ args.since.toISOString() }&<% } %>' +
    '<% if (args.until) { %>publishedBefore=${ args.until.toISOString() }&<% } %>' +
    'maxResults=50';

var Api = require('./base/api'),
    Google = require('./google'),
    util = require('util');

/**
 * @class YouTube
 * @extends Google
 * @param {Object} auth
 */
function YouTube (auth) {
    Google.call(this, auth);

    /**
     * standard args
     * @property $args
     * @type {Object}
     */
    this.$args = {
        mine: true,
        part: 'snippet'
    };

    /**
     * @property $log
     * @type {Function}
     */
    this.$log = require('debug')('youtube:api');
}

util.inherits(YouTube, Google);

/**
 * @link http://goo.gl/aHuDOq
 * @method activities
 * @param {Object} args
 * @return {Q.Promise}
 */
YouTube.prototype.activities = Api.request.oauth2.get(URL_ACTIVITIES, ['args']);

module.exports = YouTube;
