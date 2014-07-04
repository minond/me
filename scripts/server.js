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

var DIR_PUBLIC = __dirname + '/../public/';

var express = require('express'),
    swig = require('swig'),
    app = express();

var mongojs = require('mongojs'),
    me = mongojs('me', ['data']);

var Entry = require('../src/entry');

/**
 * @function query
 * @param {http.Request} req
 * @param {http.Response} res
 * @param {Object} collection mongojs collection
 * @param {Object} query mongo query
 */
function query (req, res, collection, query) {
    collection.find(query, function (err, documents) {
        res.json(payload(query, err, documents));
    });
}

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
    }
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
    }
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
 * @apiParam {Int} [since]
 * @apiParam {Int} [until]
 */
app.get('/entry/query/:type/:label', function (req, res) {
    query(req, res, me.data, {
        type: req.params.type,
        label: req.params.label,
        dtstamp: {
            $gte: +req.query.since || 0,
            $lte: +req.query.until || Number.POSITIVE_INFINITY
        }
    });
});

// index page and static resources
app.get('/', render('index.html'));
app.use('/public', express.static(DIR_PUBLIC));

// config
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', DIR_PUBLIC + 'views');

// development
app.set('view cache', false);
swig.setDefaults({ cache: false });

app.listen(process.env.PORT);
