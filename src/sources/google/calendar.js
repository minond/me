'use strict';

var URL_CALENDAR_EVENTS = '/calendar/v3/calendars/${ id }/events';

var Google = require('../google'),
    Api = require('../base/api'),
    util = require('util');

/**
 * @class Google.Calendar
 * @extends Google
 * @param {Object} auth
 */
Google.Calendar = function (auth) {
    Google.call(this, auth);
};

util.inherits(Google.Calendar, Google);

/**
 * @link http://goo.gl/DhW4vY
 * @method events
 * @return {Q.Promise}
 */
Google.Calendar.prototype.events = Api.request.oauth2.get(URL_CALENDAR_EVENTS, ['id']);

module.exports = Google.Calendar;
