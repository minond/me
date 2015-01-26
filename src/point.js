'use strict';

var md5 = require('MD5'),
    point;

/**
 * @constructor
 * @class Point
 * @throws Error
 * @param {point.type} type
 * @param {point.subtype} subtype
 * @param {String} source
 * @param {Date} [date]
 * @param {String} [id]
 * @param {Object} [data]
 */
function Point(type, subtype, source, date, id, data) {
    this.type = type;
    this.subtype = subtype;
    this.source = source;
    this.date = date ? date.valueOf() : Date.now();
    this.id = id || this.date;
    this.guid = md5(type + subtype + source + this.id + this.date);
    this.data = data || {};

    if (!(type in point.type)) {
        throw new Error('Invalid type: ' + type);
    } else if (!(subtype in point.subtype)) {
        throw new Error('Invalid subtype: ' + subtype);
    }
}

/**
 * @function point
 * @param {point.type} type
 * @param {point.subtype} subtype
 * @param {String} source
 * @param {Date} [date]
 * @param {String} [id]
 * @param {Object} [data]
 */
point = function (type, subtype, source, date, id, data) {
    return new Point(type, subtype, source, date, id, data);
};

/**
 * @const
 * @property Point
 * @type {Point}
 */
point.Point = Point;

/**
 * @const
 * @property type
 * @type {Object}
 */
point.type = {
    ACTION: 'ACTION',
    ENVIRONMENT: 'ENVIRONMENT'
};
/**
 * @const
 * @property subtype
 * @type {Object}
 */
point.subtype = {
    COMMIT: 'COMMIT',
    SONG: 'SONG',
    WEATHER: 'WEATHER'
};

module.exports = point;
