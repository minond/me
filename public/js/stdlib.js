'use strict';

/* global d3 */

/**
 * @function node
 * @param {string} container selector of parent node
 * @return {Node}
 */
function node (container) {
    return d3.select(container).append('span')[0][0];
}
