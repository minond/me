'use strict';

/**
 * @apiDefineSuccessStructure StdSuccess
 * @apiSuccess {Object} request
 * @apiSuccess {Object} result Match count and query information
 * @apiSuccess {Object} data Array of entries
 *
 * @apiDefineErrorStructure StdError
 * @apiError {Object} request Includes failure information
 * @apiError {null} result
 * @apiError {null} data
 */

var DIR_PUBLIC = __dirname + '/../public/',
    DIR_SOURCE = __dirname + '/../src/';

var express = require('express'),
    swig = require('swig'),
    moment = require('moment'),
    app = express();

var mongojs = require('mongojs'),
    me = mongojs('me', ['data']);

var Entry = require('../src/entry');

/**
 * @function payload
 * @param {Object} query
 * @param {Error} [err]
 * @param {Object} documents response from mongo query
 * @return {Object}
 */
function payload (query, err, documents) {
    documents = err ? [] : documents;
    return {
        request: {
            error: !!err,
            message: err ? err.message : ''
        },
        result: {
            len: documents.length,
            query: query
        },
        data: documents
    };
}

/**
 * @function query
 * @param {http.Request} req
 * @param {http.Response} res
 * @param {Object} collection mongojs collection
 * @param {Object} filters mongo query filters
 */
function query (req, res, collection, filters) {
    collection.find(filters).sort({ dtstamp: 1 }, function (err, documents) {
        res.json(payload(filters, err, documents));
    });
}

/**
 * generates a function that can be used to render files
 * @function render
 * @param {string} file
 * @return {Function}
 */
function render (file) {
    return function (req, res) {
        res.render(file);
    };
}

/**
 * @api {get} /entry/schema Get the entry schema
 * @apiName EntrySchema
 * @apiGroup Entry
 * @apiSuccessStructure StdSuccess
 */
app.get('/entry/schema', function (req, res) {
    res.json(payload({}, null, Entry.schema));
});

/**
 * @api {get} /entry/query/:type/:label Query entries collection
 * @apiName EntryQuery
 * @apiGroup Entry
 *
 * @apiSuccessStructure StdSuccess
 * @apiErrorStructure StdError
 *
 * @apiParam {String} type
 * @apiParam {String} label
 * @apiParam {String} [since] ISO-8601 string
 * @apiParam {String} [until] ISO-8601 string
 */
app.get('/entry/query/:type?/:label?', function (req, res) {
    var filter = {
        dtstamp: {
            $gte: req.query.since ? moment(req.query.since).valueOf() : 0,
            $lte: req.query.until ? moment(req.query.until).valueOf() : Number.POSITIVE_INFINITY
        }
    };

    if (req.params.type) {
        filter.type = req.params.type;
    }

    if (req.params.label) {
        filter.label = req.params.label;
    }

    query(req, res, me.data, filter);
});

// index page and static resources
app.get('/', render('index.html'));
app.get('/design', render('design.html'));
app.use('/src', express.static(DIR_SOURCE));
app.use('/public', express.static(DIR_PUBLIC));

// config
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

// development
app.set('view cache', false);
swig.setDefaults({ cache: false });

app.listen(process.env.PORT);
