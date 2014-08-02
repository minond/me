'use strict';

var DATE_FORMAT = 'YYYYMMDDTHHmmssZZ';

var Entry = require('../../../entry'),
    moment = require('moment'),
    log = require('debug')('location:place:moves_app:getter');

/**
 * @function is_custom_place
 * @param {Object} segment
 * @return {Boolean}
 */
function is_custom_place (segment) {
    return segment.place.type !== 'foursquare';
}

/**
 * @function is_foursquare_place
 * @param {Object} segment
 * @return {Boolean}
 */
function is_foursquare_place (segment) {
    return segment.place.type === 'foursquare';
}

/**
 * @param {Object} storage
 * @param {MovesApp} moves
 * @param {Object} filters
 */
module.exports = function (storage, moves, filters) {
    var since = filters.since,
        until = filters.until;

    log('getting physical location datafrom fitbit from %s to %s', since, until);
    moves.places(since, until).then(function (days) {
        days.forEach(function (day) {
            day.segments.filter(function (segment) {
                return segment.type === 'place';
            }).forEach(function (segment) {
                var start = moment(segment.startTime, DATE_FORMAT).toDate(),
                    end = moment(segment.endTime, DATE_FORMAT).toDate(),
                    suid = Entry.datetime2suid(start);

                var entry = new Entry('place', suid, {
                    start: start.valueOf(),
                    end: end.valueOf(),
                    name: segment.place.name,
                    latitude: segment.place.location.lat,
                    longitude: segment.place.location.lon,
                    source: {
                        type: segment.place.type,
                        custom: is_custom_place(segment),
                        foursquare: is_foursquare_place(segment),
                        foursquare_id: segment.place.foursquareId,
                        foursquare_category_ids: segment.place.foursquareCategoryIds
                    }
                });

                entry.source = 'MovesApp';
                entry.dtstamp = start;
                log('saving %s', entry.id());
            });
        });
    });
};
