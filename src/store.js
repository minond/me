'use strict';

var UPDATE_OPT = { upsert: true };

var Q = require('q'),
    format = require('util').format,
    log = require('debug')('storage'),
    logError = require('debug')('storage:error');

function logSave(point, cb) {
    return function (err) {
        if (err) {
            logError('error saving %s: %s', point.guid, err.message);
        } else {
            log('successfully saved %s', point.guid);
        }

        if (cb) {
            cb(err, point);
        }
    };
}

function connect(MongoClient, config) {
    var uri = format('mongodb://%s:%s/%s',
        config.get('storage.host'),
        config.get('storage.port'),
        config.get('storage.name'));

    var deferred = Q.defer(),
        collection;

    log('connecting to %s', uri);
    MongoClient.connect(uri, function (err, db) {
        if (err) {
            logError('error connecting: %s', err.message);
            deferred.reject(err);
            return;
        }

        collection = db.collection(config.get('storage.coll'));
        deferred.resolve(function store(point, cb) {
            log('saving %s', point.guid);
            collection.update({
                type: point.type,
                subtype: point.subtype,
                guid: point.guid
            }, {
                type: point.type,
                subtype: point.subtype,
                source: point.source,
                date: point.date,
                id: point.id,
                guid: point.guid,
                data: point.data
            }, UPDATE_OPT, logSave(point, cb));
        });
    });

    return deferred.promise;
}

module.exports = connect;
