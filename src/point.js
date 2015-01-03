'use strict';

var md5 = require('MD5'),
    point;

/**
 * @constructor
 * @class Point
 * @throws Error
 * @param {point.type} type
 * @param {point.subtype} subtype
 * @param {Date} date
 * @param {String} source
 * @param {Object} data
 */
function Point(type, subtype, date, source, data) {
    this.type = type;
    this.subtype = subtype;
    this.source = source;
    this.date = date || new Date();
    this.data = data || {};
    this.guid = md5(type + subtype + source + this.date);

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
 * @param {Date} date
 * @param {String} source
 * @param {Object} data
 */
point = function (type, subtype, date, source, data) {
    return new Point(type, subtype, date, source, data);
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
    ENVIRONMENT: 'ENVIRONMENT'
};
/**
 * @const
 * @property subtype
 * @type {Object}
 */
point.subtype = {
    WEATHER: 'WEATHER'
};

module.exports = point;
