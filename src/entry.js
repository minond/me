'use strict';

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
    commit: {
        type: Entry.SCHEMA.TYPES.ACTION,
        source: 'github.com'
    }
};

module.exports = Entry;
