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

        if (cb && cb instanceof Function) {
            cb(err, point);
        }
    };
}

function connect(MongoClient, config) {
    var uri = format('mongodb://%s:%s/%s',
        config.get('database.host'),
        config.get('database.port'),
        config.get('database.name'));

    var deferred = Q.defer(),
        collection;

    log('connecting to %s', uri);
    MongoClient.connect(uri, function (err, db) {
        if (err) {
            logError('error connecting: %s', err.message);
            deferred.reject(err);
            return;
        }

        function store(point, cb) {
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
        }

        log('connection made');
        collection = db.collection(config.get('storage.coll'));
        store.$collection = collection;
        store.$db = db;
        deferred.resolve(store);
    });

    return deferred.promise;
}

module.exports = connect;
