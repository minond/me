'use strict';

describe('storage', function () {
    var store,
        entry;

    var MongoClient = require('mongodb').MongoClient,
        config = require('acm');

    var assert = require('assert'),
        point = require('../../src/point'),
        connect = require('../../src/store');

    var type = point.type,
        subtype = point.subtype;

    /* global before */
    before(function (done) {
        connect(MongoClient, config).then(function (_store_) {
            store = _store_;
            done();
        });
    });

    it('can save point', function (done) {
        entry = point(type.ACTION, subtype.COMMIT);
        store(entry, done);
    });

    it('can update point', function (done) {
        entry = point(type.ACTION, subtype.COMMIT);
        entry.data.name = 'Marcos';

        // initial save of point
        // runs insert since it's new
        store(entry, function (err) {
            assert(!err);

            // next save of point
            // runs update instead of insert
            entry.data.name = 'Marcos Minond';
            store(entry, function (err) {
                assert(!err);

                // query mongo using id and check document sent back for the
                // updates make on the second call to `store`
                store.$collection.find({ guid: entry.guid }).toArray(function (err, res) {
                    assert(!err);
                    assert.equal(1, res.length);
                    assert.equal(entry.data.name, res[0].data.name);
                    done();
                });
            });
        });
    });
});
