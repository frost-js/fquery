/** @import { NodeFilterInput } from '../../filters.js'; */
/** @import { QueryContextInput } from '../../traversal/find.js'; */
/** @import { QueryInput } from '../../helpers.js'; */

import { merge, unique } from '@fr0st/core';
import { getContext } from './../../config.js';
import { parseNodes } from './../../filters.js';
import { index as _index, indexOf as _indexOf, normalize as _normalize, serialize as _serialize, serializeArray as _serializeArray, sort as _sort, tagName as _tagName } from './../../utility/utility.js';
import QuerySet from './../query-set-core.js';

/**
 * Merges with new nodes and sorts the results.
 * @param {QueryInput} selector The input selector.
 * @param {QueryContextInput} [context] The context to search in.
 * @returns {QuerySet} The QuerySet object.
 */
export function add(selector, context = null) {
    const otherNodes = parseNodes(selector, {
        node: true,
        fragment: true,
        shadow: true,
        document: true,
        window: true,
        html: true,
        context: context || getContext(),
    });
    const nodes = _sort(unique(merge([], this.get(), otherNodes)));

    return new QuerySet(nodes);
};

/**
 * Reduces the set of nodes to the one at the specified index.
 * @param {number} index The index of the node.
 * @returns {QuerySet} The QuerySet object.
 */
export function eq(index) {
    const node = this.get(index);

    return new QuerySet(node ? [node] : []);
};

/**
 * Reduces the set of nodes to the first.
 * @returns {QuerySet} The QuerySet object.
 */
export function first() {
    return this.eq(0);
};

/**
 * Gets the index of the first node relative to its parent node.
 * @returns {number|undefined} The index, or `undefined` if no node or parent matches.
 */
export function index() {
    return _index(this);
};

/**
 * Gets the index of the first node matching a filter.
 * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
 * @returns {number} The index.
 */
export function indexOf(nodeFilter) {
    return _indexOf(this, nodeFilter);
};

/**
 * Reduces the set of nodes to the last.
 * @returns {QuerySet} The QuerySet object.
 */
export function last() {
    return this.eq(-1);
};

/**
 * Normalizes nodes (remove empty text nodes, and join adjacent text nodes).
 * @returns {QuerySet} The QuerySet object.
 */
export function normalize() {
    _normalize(this);

    return this;
};

/**
 * Returns a serialized string containing names and values of all form nodes.
 * @returns {string} The serialized string.
 */
export function serialize() {
    return _serialize(this);
};

/**
 * Returns a serialized array containing names and values of all form nodes.
 * @returns {Array<{name: string, value: string}>} The serialized entries.
 */
export function serializeArray() {
    return _serializeArray(this);
};

/**
 * Sorts nodes by their position in the document.
 * @returns {QuerySet} The QuerySet object.
 */
export function sort() {
    return new QuerySet(_sort(this));
};

/**
 * Returns the tag name (lowercase) of the first node.
 * @returns {string|undefined} The node's lowercase tag name, or `undefined` if no element matches.
 */
export function tagName() {
    return _tagName(this);
};
