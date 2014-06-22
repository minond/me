'use strict';

/**
 * adds an "upserrt" method to a collection object
 * @function upserts
 * @param {Object} coll
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
                    log('succesfully saved to collection');
                } else {
                    log('error: %s', err.message);
                }
            });
        };
    })();
};
