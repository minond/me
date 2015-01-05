'use strict';

describe('Store', function () {
    var Client,
        config;

    var conn_error,
        conn_database,
        conn_collection;

    var assert = require('assert'),
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
        conn_collection = {};

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
});
