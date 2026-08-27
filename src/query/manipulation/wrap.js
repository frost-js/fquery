/** @import { NodeFilterInput } from '../../filters.js'; */
/** @import { NodeInput } from '../../helpers.js'; */
/** @import QuerySet from '../query-set.js'; */

import { unwrap as _unwrap, wrap as _wrap, wrapAll as _wrapAll, wrapInner as _wrapInner } from './../../manipulation/wrap.js';

/**
 * Unwraps each node.
 * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
 * @returns {QuerySet} The QuerySet object.
 */
export function unwrap(nodeFilter) {
    _unwrap(this, nodeFilter);

    return this;
};

/**
 * Wraps each nodes with other nodes.
 * @param {NodeInput} otherSelector The other node(s), or a query selector or HTML string.
 * @returns {QuerySet} The QuerySet object.
 */
export function wrap(otherSelector) {
    _wrap(this, otherSelector);

    return this;
};

/**
 * Wraps all nodes with other nodes.
 * @param {NodeInput} otherSelector The other node(s), or a query selector or HTML string.
 * @returns {QuerySet} The QuerySet object.
 */
export function wrapAll(otherSelector) {
    _wrapAll(this, otherSelector);

    return this;
};

/**
 * Wraps the contents of each node with other nodes.
 * @param {NodeInput} otherSelector The other node(s), or a query selector or HTML string.
 * @returns {QuerySet} The QuerySet object.
 */
export function wrapInner(otherSelector) {
    _wrapInner(this, otherSelector);

    return this;
};
