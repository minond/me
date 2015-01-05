'use strict';

describe('Store', function () {
    var Client,
        config;

    var conn_error,
        conn_database,
        conn_collection,
        conn_call_query,
        conn_call_data;

    var assert = require('assert'),
        point = require('../src/point'),
        connect = require('../src/store');

    function check(done, action) {
        try {
            action();
            done();
        } catch (err) {
            done(err);
        }
    }

    beforeEach(function () {
        conn_error = null;
        conn_call_data = null;
        conn_call_query = null;

        conn_collection = {
            update: function (query, point) {
                conn_call_query = query;
                conn_call_data = data;
            }
        };

        conn_database = {
            collection: function () {
                return conn_collection;
            }
        };

        Client = {
            connect: function (uri, cb) {
                cb(conn_error, conn_database);
            }
        };

        config = {
            get: function () {}
        };
    });

    it('resolves promise with the store function', function (done) {
        connect(Client, config).then(function (store) {
            check(done, function () {
                assert(store instanceof Function);
            });
        });
    });

    it('rejects promise with the connection problems', function (done) {
        conn_error = new Error('testing 123');

        connect(Client, config).then(function () {}, function (err) {
            check(done, function () {
                assert.equal(err, conn_error);
            });
        });
    });

    it('uses a point\'s type, subtype, and guid to run upsers', function () {
        connect(Client, config).then(function (store) {
            var entry = point(point.type.ACTION, point.subtype.COMMIT);

            store(point);

            check(done, function () {
                assert.deepEqual(conn_call_query, {
                    type: entry.type,
                    subtype: entry.subtype,
                    guid: entry.guid
                });
            });
        });
    });
});
