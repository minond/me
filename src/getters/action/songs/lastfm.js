'use strict';

// var TYPE = require('../../../point').type.ACTION,
//     SUBTYPE = require('../../../point').subtype.SONG,
//     SOURCE = 'lastfm';

// var point = require('../../../point'),
//     log = require('debug')('getter:action:songs:lastfm');
var log = require('debug')('getter:action:songs:lastfm');

/**
 * gets all scrobble songs from lastfm
 * @param {Lastfm} lastfm
 * @param {Object} storage
 * @param {moment.range} range
 */
module.exports = function (lastfm, storage, range) {
    var dates = range.toDate(),
        until = dates.pop(),
        since = dates.pop();

    (function download(page) {
        log('getting songs from %s to %s (%s)', since, until, page);
        lastfm.recent_tracks(since, until, page).then(function (songs) {
            console.log(songs);
        });
    })(1);
};
