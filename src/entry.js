'use strict';

/**
 * {
 *     "schema": {
 *         "label": "a unique identifier of this type of entry",
 *         "type": "type of data",
 *         "source": "where I'm getting this data from",
 *         "dtstamp_since": "data covers the time period from",
 *         "dtstamp_until": "data covers the time period to",
 *         "dtstamp": "data is on this time"
 *     }
 *
 *     "types": {
 *         "environment": "things around me I cannot control",
 *         "action": "things I do",
 *         "metadata": "information/data about information/data"
 *     }
 *
 *     "examples": [
 *         {
 *             "label": "weather",
 *             "type": "environment",
 *             "source": "yahoo.com",
 *             "since": "2014...",
 *             "until": "2014...",
 *             "data": {
 *                 "temp": 0,
 *                 "high": 0,
 *                 "low": 0
 *             }
 *         },
 *
 *         {
 *             "label": "listen_music",
 *             "type": "action",
 *             "source": "last.fm",
 *             ""
 *         },
 *
 *         {
 *             "label": "repositories",
 *             "type": "metadata",
 *             "source": "github.com",
 *             "data": {
 *                 "321": {
 *                     "name": "me",
 *                     "full_name": "minond/me",
 *                     "url": "https://..."
 *                 }
 *             }
 *         },
 *
 *         {
 *             "label": "commit",
 *             "type": "action",
 *             "source": "github.com",
 *             "since": "2014...",
 *             "until": "2014...",
 *             "data": {
 *                 "123": {
 *                     "url": "https://...",
 *                     "message": "this is what is did",
 *                     "date": "2014...",
 *                     "repo": "321"
 *                 }
 *             }
 *         }
 *     ]
 * }
 */

/**
 * @constructor
 * @class Entry
 * @param {string} [label]
 * @param {string} [suid]
 * @param {Object} data
 */
function Entry (label, suid, data) {
    var info;

    if (!data && !suid) {
        data = label;
        label = undefined;
        suid = undefined;
    } else if (!data) {
        data = suid;
        suid = undefined;
    }

    /**
     * @property type
     * @type {string}
     * @see Entry.SCHEMA.TYPES
     */
    this.type = null;

    /**
     * @property source
     * @type {string}
     */
    this.source = null;

    /**
     * @property dtstamp
     * @type {Date}
     */
    this.dtstamp = new Date();

    /**
     * @property label
     * @type {string}
     */
    this.label = label;

    /**
     * @property data
     * @type {Object}
     */
    this.data = data || {};

    /**
     * semi unique identifier
     * @property suid
     * @type {string}
     */
    this.suid = suid || Math.random().toString().substr(-10);

    if (label in Entry.INFO) {
        info = Entry.INFO[ label ];
        this.type = info.type;
        this.source = info.source;
    }
}

/**
 * @method id
 * @return {string}
 */
Entry.prototype.id = function () {
    return [
        this.type,
        this.label,
        this.dtstamp.valueOf(),
        this.suid
    ].join('-');
};

/**
 * @property schema
 * @final
 * @type {Object}
 */
Entry.SCHEMA = {
    TYPES: {
        ACTION: 'action',
        ENVIRONMENT: 'environment',
        METADATA: 'metadata'
    }
};

/**
 * @property schema
 * @final
 * @type {Object}
 */
Entry.INFO = {
    weather: {
        type: Entry.SCHEMA.TYPES.ENVIRONMENT,
        source: 'msn.com'
    },
    commit: {
        type: Entry.SCHEMA.TYPES.ACTION,
        source: 'github.com'
    }
};

module.exports = Entry;
