'use strict';

/**
 * {
 *     "schema": {
 *         "label": "a unique identifier of this type of entry",
 *         "type": "type of data",
 *         "source": "where I'm getting this data from",
 *         "dtstamp": "data is on this time"
 *     }
 *
 *     "types": {
 *         "environment": "things around me I cannot control",
 *         "health": "health related actions (sleep, steps, etc.)",
 *         "action": "things I do"
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
 * @throws Error
 * @param {string} label
 * @param {string} [suid]
 * @param {Object} [data]
 */
function Entry (label, suid, data) {
    if (!data && suid) {
        data = suid;
        suid = undefined;
    }

    if (!(label in Entry.schema.labels)) {
        throw new Error('Invalid entry label: ' + label);
    }

    /**
     * @property type
     * @type {string}
     * @see Entry.schema.types
     */
    this.type = Entry.schema.labels[ label ];

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
 * @method json
 * @return {Object}
 */
Entry.prototype.json = function () {
    return {
        id: this.id(),
        type: this.type,
        source: this.source,
        dtstamp: +this.dtstamp,
        label: this.label,
        data: this.data
    };
};

/**
 * @property schema
 * @final
 * @type {Object}
 */
Entry.schema = {};

/**
 * @property schema.types
 * @final
 * @type {Object}
 */
Entry.schema.types = {
    ACTION: 'action',
    ENVIRONMENT: 'environment',
    HEALTH: 'health'
};

/**
 * @property schema.labels
 * @final
 * @type {Object}
 */
Entry.schema.labels = {
    commit: Entry.schema.types.ACTION,
    sleep: Entry.schema.types.HEALTH,
    song: Entry.schema.types.ACTION,
    steps: Entry.schema.types.HEALTH,
    water: Entry.schema.types.HEALTH,
    weather: Entry.schema.types.ENVIRONMENT,
    weight: Entry.schema.types.HEALTH
};

module.exports = Entry;
