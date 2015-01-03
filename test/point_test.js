'use strict';

describe('Point', function () {
    var assert = require('assert'),
        point = require('../src/point');

    describe('#constructor', function () {
        it('throws an errors on invalid types', function () {
            assert.throws(function () {
                point('blah');
            }, /Invalid type: blah/);
        });

        it('throws an errors on invalid subtypes', function () {
            assert.throws(function () {
                point(point.type.ENVIRONMENT, 'blah');
            }, /Invalid subtype: blah/);
        });

        it('returns a Point on success', function () {
            assert(point(point.type.ENVIRONMENT, point.subtype.WEATHER) instanceof point.Point);
        });

        it('sets a blank data object', function () {
            assert(point(point.type.ENVIRONMENT, point.subtype.WEATHER).data);
        });

        it('sets date to today', function () {
            assert(point(point.type.ENVIRONMENT, point.subtype.WEATHER).date);
        });

        it('assigns a guid', function () {
            assert(point(point.type.ENVIRONMENT, point.subtype.WEATHER).guid);
        });
    });

    describe('.guid', function () {
        it('assigns the same guids when (sub)types are the same and everything else is not set', function () {
            var p1 = point(point.type.ENVIRONMENT, point.subtype.WEATHER),
                p2 = point(point.type.ENVIRONMENT, point.subtype.WEATHER);

            assert.equal(p1.guid, p2.guid);
        });

        it('assigns different guids when (sub)types are the same but the source is different', function () {
            var p1 = point(point.type.ENVIRONMENT, point.subtype.WEATHER, 'one'),
                p2 = point(point.type.ENVIRONMENT, point.subtype.WEATHER, 'two');

            assert.notEqual(p1.guid, p2.guid);
        });

        it('assigns different guids when (sub)types and source are the same but the date is different', function () {
            var p1 = point(point.type.ENVIRONMENT, point.subtype.WEATHER, 'one', new Date('2014-01-01')),
                p2 = point(point.type.ENVIRONMENT, point.subtype.WEATHER, 'one', new Date('2015-01-01'));

            assert.notEqual(p1.guid, p2.guid);
        });
    });
});
