'use strict';

describe('Entry', function () {
    var entry, data;

    var Entry = require('../../../src/entry'),
        expect = require('expect.js');

    beforeEach(function () {
        entry = new Entry('song', {});
        data = { name: 'hihi' };
    });

    describe('#constructor', function () {
        it('takes a label, suid, and data', function () {
            entry = new Entry('song', 123, data);
            expect(entry.label).to.be('song');
            expect(entry.data).to.be(data);
            expect(entry.suid).to.be(123);
        });

        it('makes the suid optional', function () {
            entry = new Entry('song', data);
            expect(entry.label).to.be('song');
            expect(entry.data).to.be(data);
            expect(entry.suid).to.not.be(null);
            expect(entry.suid).to.not.be(undefined);
        });

        it('makes the data optional', function () {
            entry = new Entry('song');
            expect(entry.label).to.be('song');
            expect(entry.data).to.be.an('object');
        });

        it('always gets a suid', function () {
            expect(entry.suid).to.not.be(null);
            expect(entry.suid).to.not.be(undefined);
        });

        it('includes preset information about the entry type', function () {
            entry = new Entry('song', data);
            expect(entry.type).to.be(Entry.schema.types.ACTION);
        });

        it('throws an error when an invalid label is passed', function () {
            expect(function () {
                return new Entry('invalid');
            }).to.throwException(function (err) {
                expect(err).to.be.an(Error);
                expect(err.message).to.be('Invalid entry label: invalid');
            });
        });
    });

    describe('#json', function () {
        it('returns needed info', function () {
            entry = new Entry('song', 123, data);
            entry = entry.json();

            expect(entry.id).to.not.be(undefined);
            expect(entry.type).to.not.be(undefined);
            expect(entry.source).to.not.be(undefined);
            expect(entry.dtstamp).to.not.be(undefined);
            expect(entry.label).to.not.be(undefined);
            expect(entry.data).to.not.be(undefined);
        });
    });

    describe('#id', function () {
        it('generates an id', function () {
            entry = new Entry('song', 123, data);
            expect(entry.id()).to.be([
                Entry.schema.types.ACTION,
                'song',
                entry.dtstamp.valueOf(),
                123
            ].join('-'));
        });
    });
});
