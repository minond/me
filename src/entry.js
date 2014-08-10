'use strict';

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
        dtstamp: +this.dtstamp,
        type: this.type,
        label: this.label,
        source: this.source,
        data: this.data
    };
};

/**
 * generates a suid using a date object
 * @function date2suid
 * @static
 * @param {Date} date
 * @return {string}
 */
Entry.date2suid = function (date) {
    return [
        date.getFullYear(),
        date.getMonth(),
        date.getFullYear(),
        date.getDate(),
        date.getFullYear()
    ].join('');
};

/**
 * generates a suid using a date and time object
 * @function datetime2suid
 * @static
 * @param {Date} date
 * @return {string}
 */
Entry.datetime2suid = function (date) {
    return [
        date.getFullYear(),
        date.getMonth(),
        date.getFullYear(),
        date.getDate(),
        date.getFullYear(),
        date.getHours(),
        date.getFullYear(),
        date.getMinutes(),
        date.getFullYear(),
        date.getSeconds()
    ].join('');
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
    HEALTH: 'health',
    LOCATION: 'location'
};

/**
 * @property schema.labels
 * @final
 * @type {Object}
 */
Entry.schema.labels = {
    commit: Entry.schema.types.ACTION,
    computer: Entry.schema.types.ACTION,
    fat: Entry.schema.types.HEALTH,
    place: Entry.schema.types.LOCATION,
    sleep: Entry.schema.types.HEALTH,
    song: Entry.schema.types.ACTION,
    steps: Entry.schema.types.HEALTH,
    water: Entry.schema.types.HEALTH,
    weather: Entry.schema.types.ENVIRONMENT,
    weight: Entry.schema.types.HEALTH
};

/**
 * human-friendly documentation
 * @final
 * @type {Object}
 */
Entry.schema.documentation = {
    entry: {
        id: '{String} a unique id',
        type: '{Entry.schema.types} the entry\'s group',
        label: '{Entry.schema.labels} the entry\'s sub-group',
        source: '{String} where this data was retrieved from (website, app name, etc.)',
        dtstamp: '{Number} datetime (ms) stamp of the entry',
        data: '{Object} any information relevant to this entry'
    },
    types: {
        action: 'things I do (write code, listen to a song)',
        environment: 'things around me I cannot control (the weather, phase of the moon)',
        health: 'health related actions (how I slept, how many steps I take)',
        location: 'information about the physical location I in (name of place, how loud)'
    }
};

module.exports = Entry;
