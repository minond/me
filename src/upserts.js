'use strict';

/**
 * adds an "upserrt" method to a collection object
 * @function upserts
 * @param {Object} coll
 * @return {Object}
 */
module.exports = function upserts (coll) {
    coll.upsert = (function () {
        var log = require('debug')('mongo');

        return function (entry) {
            var query = { id: entry.id() },
                options = { upsert: true },
                data = entry.json();

            coll.update(query, data, options, function (err) {
                if (!err) {
                    log('succesfully saved %s', entry.id());
                } else {
                    log('error saving %s: %s', entry.id(), err.message);
                }
            });
        };
    })();

    return coll;
};
