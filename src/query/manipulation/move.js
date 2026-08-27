/** @import { NodeInput } from '../../helpers.js'; */
/** @import QuerySet from '../query-set.js'; */

import { after as _after, append as _append, appendTo as _appendTo, before as _before, insertAfter as _insertAfter, insertBefore as _insertBefore, prepend as _prepend, prependTo as _prependTo } from './../../manipulation/move.js';

/**
 * Inserts each other node after the first node.
 * @param {NodeInput} otherSelector The other node(s), or a query selector or HTML string.
 * @returns {QuerySet} The QuerySet object.
 */
export function after(otherSelector) {
    _after(this, otherSelector);

    return this;
};

/**
 * Appends each other node to the first node.
 * @param {NodeInput} otherSelector The other node(s), or a query selector or HTML string.
 * @returns {QuerySet} The QuerySet object.
 */
export function append(otherSelector) {
    _append(this, otherSelector);

    return this;
};

/**
 * Appends each node to the first other node.
 * @param {NodeInput} otherSelector The other node(s), or a query selector string.
 * @returns {QuerySet} The QuerySet object.
 */
export function appendTo(otherSelector) {
    _appendTo(this, otherSelector);

    return this;
};

/**
 * Inserts each other node before the first node.
 * @param {NodeInput} otherSelector The other node(s), or a query selector or HTML string.
 * @returns {QuerySet} The QuerySet object.
 */
export function before(otherSelector) {
    _before(this, otherSelector);

    return this;
};

/**
 * Inserts each node after the first other node.
 * @param {NodeInput} otherSelector The other node(s), or a query selector string.
 * @returns {QuerySet} The QuerySet object.
 */
export function insertAfter(otherSelector) {
    _insertAfter(this, otherSelector);

    return this;
};

/**
 * Inserts each node before the first other node.
 * @param {NodeInput} otherSelector The other node(s), or a query selector string.
 * @returns {QuerySet} The QuerySet object.
 */
export function insertBefore(otherSelector) {
    _insertBefore(this, otherSelector);

    return this;
};

/**
 * Prepends each other node to the first node.
 * @param {NodeInput} otherSelector The other node(s), or a query selector or HTML string.
 * @returns {QuerySet} The QuerySet object.
 */
export function prepend(otherSelector) {
    _prepend(this, otherSelector);

    return this;
};

/**
 * Prepends each node to the first other node.
 * @param {NodeInput} otherSelector The other node(s), or a query selector string.
 * @returns {QuerySet} The QuerySet object.
 */
export function prependTo(otherSelector) {
    _prependTo(this, otherSelector);

    return this;
};
