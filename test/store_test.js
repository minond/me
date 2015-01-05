'use strict';

describe('Store', function () {
    var Client,
        config,
        entry;

    var conn_error,
        conn_database,
        conn_collection,
        conn_call_error,
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
        entry = point(point.type.ACTION, point.subtype.COMMIT);

        conn_error = null;
        conn_call_error = null;
        conn_call_data = null;
        conn_call_query = null;

        conn_collection = {
            update: function (query, data, opt, cb) {
                conn_call_query = query;
                conn_call_data = data;

                if (cb) {
                    cb(conn_call_error);
                }
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
        conn_error = new Error('cannot connect');

        connect(Client, config).then(function () {}, function (err) {
            check(done, function () {
                assert.equal(err, conn_error);
            });
        });
    });

    it('uses a point\'s type, subtype, and guid to run upsers', function (done) {
        connect(Client, config).then(function (store) {
            store(entry);
            check(done, function () {
                assert.deepEqual(conn_call_query, {
                    type: entry.type,
                    subtype: entry.subtype,
                    guid: entry.guid
                });
            });
        });
    });

    it('passed query errors to update calls', function (done) {
        conn_call_error = new Error('cannot update');

        connect(Client, config).then(function (store) {
            store(entry, function (err) {
                check(done, function () {
                    assert.equal(err, conn_call_error);
                });
            });
        });
    });
});
