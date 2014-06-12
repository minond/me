'use strict';

var EventEmitter = require('events').EventEmitter,
    util = require('util'),
    lodash = require('lodash');

/**
 * @constructor
 * @class Retriever
 * @param {Object} config
 */
function Retriever(config) {
    EventEmitter.call(this);

    /**
     * configuration use in retrieval of data
     * @property config
     * @type {Object}
     */
    this.config = config;
}

util.inherits(Retriever, EventEmitter);

/**
 * @final
 */
Retriever.EVENTS = {};

/**
 * fired when a retriever has enough data to process
 * @final
 * @event data
 */
Retriever.EVENTS.data = 'data';

/**
 * @final
 * @event start
 */
Retriever.EVENTS.start = 'start';

/**
 * @final
 * @event error
 */
Retriever.EVENTS.error = 'error';

/**
 * @final
 * @event end
 */
Retriever.EVENTS.end = 'end';

/**
 * retrives data
 * @final
 * @method run
 */
Retriever.prototype.run = function () {
    var me = this;

    this.emit(Retriever.EVENTS.start);
    this.retrieve(function (err, res) {
        if (err) {
            me.emit(Retriever.EVENTS.error, err);
        } else {
            me.emit(Retriever.EVENTS.end, res);
        }
    });
};

module.exports = Retriever;
