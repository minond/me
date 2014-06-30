'use strict';

var Entry = require('../entry'),
    log = require('debug')('lastfm:getter');

/**
 * @function get_lastfm_data
 * @param {Object} storage
 * @param {Lastfm} lastfm
 * @param {Object} filters
 */
module.exports = function get_lastfm_data (storage, lastfm, filters) {
    var since = filters.since,
        until = filters.until;

    (function getrecenttracks (page) {
        lastfm.getrecenttracks(since, until, page).then(function (user) {
            var attr = user.recenttracks['@attr'];

            if (page < +attr.totalPages) {
                getrecenttracks(page + 1);
            }

            user.recenttracks.track.forEach(function (track) {
                var dtint = track.date ? track.date['#text'] : Date.now(),
                    dtstamp = new Date(dtint),
                    suid = track.mbid || (track.name + track.artist['#text'])
                        .replace(/\W+/g, '').toLowerCase();

                var entry = new Entry('song', +dtstamp + suid, {
                    mbid: track.mbid,
                    name: track.name,
                    url: track.url,
                    img: track.image.pop()['#text'],
                    artist: {
                        mbid: track.artist.mbid,
                        name: track.artist['#text'],
                    },
                    album: {
                        mbid: track.album.mbid,
                        name: track.album['#text'],
                    }
                });

                entry.dtstamp = dtstamp;
                log('saving %s', entry.id());
                storage.upsert(entry);
            });
        });
    })(1);
};
