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
    });
});
