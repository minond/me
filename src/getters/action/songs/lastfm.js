'use strict';

var TYPE = require('../../../point').type.ACTION,
    SUBTYPE = require('../../../point').subtype.SONG,
    SOURCE = 'lastfm';

var point = require('../../../point'),
    log = require('debug')('getter:action:songs:lastfm');

/**
 * @param {Object} song
 * @return {Boolean}
 */
function has_played(song) {
    return 'date' in song;
}

/**
 * this is what a song looks like:
 * {
 *   "artist": {
 *     "#text": "Little Simz",
 *     "mbid": "3cdb40fe-a63e-4bb9-b40d-17cda5f50979"
 *   },
 *   "name": "The Square",
 *   "streamable": "0",
 *   "mbid": "0a395727-c26d-4d5f-816e-560a218a3fa2",
 *   "album": {
 *     "#text": "Age 101 : Drop 2",
 *     "mbid": ""
 *   },
 *   "url": "http://www.last.fm/music/Little+Simz/_/The+Square",
 *   "image": [
 *     {
 *       "#text": "http://userserve-ak.last.fm/serve/34s/101245987.jpg",
 *       "size": "small"
 *     },
 *     {
 *       "#text": "http://userserve-ak.last.fm/serve/64s/101245987.jpg",
 *       "size": "medium"
 *     },
 *     {
 *       "#text": "http://userserve-ak.last.fm/serve/126/101245987.jpg",
 *       "size": "large"
 *     },
 *     {
 *       "#text": "http://userserve-ak.last.fm/serve/174s/101245987.jpg",
 *       "size": "extralarge"
 *     }
 *   ],
 *   "date": {
 *     "#text": "25 Jan 2015, 04:13",
 *     "uts": "1422159185"
 *   }
 * }
 *
 * @param {Object} song
 * @return {Point}
 */
function extract_song(song) {
    return point(TYPE, SUBTYPE, SOURCE, new Date(song.date['#text']), song.url + song.mbid, {
        song: song.name,
        artist: song.artist['#text'],
        album: song.album['#text'],
        mbid: song.mbid,
        url: song.url
    });
}

/**
 * gets all scrobble songs from lastfm
 * @param {Lastfm} lastfm
 * @param {Function} store
 * @param {moment.range} range
 */
module.exports = function (lastfm, store, range) {
    var dates = range.toDate(),
        until = dates.pop(),
        since = dates.pop();

    (function download(page) {
        log('getting songs from %s to %s (page: %s)', since, until, page);

        lastfm.recent_tracks(since, until, page).then(function (songs) {
            songs.recenttracks.track
                .filter(has_played)
                .map(extract_song)
                .forEach(store);

            if (songs.recenttracks.track.length) {
                download(page + 1);
            }
        });
    })(1);
};
