/** @import { NodeFilterInput } from '../../filters.js'; */

import { child as _child, children as _children, closest as _closest, commonAncestor as _commonAncestor, contents as _contents, fragment as _fragment, next as _next, nextAll as _nextAll, offsetParent as _offsetParent, parent as _parent, parents as _parents, prev as _prev, prevAll as _prevAll, shadow as _shadow, siblings as _siblings } from './../../traversal/traversal.js';
import QuerySet from './../query-set-core.js';

/**
 * Returns the first child of each node (optionally matching a filter).
 * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
 * @returns {QuerySet} The QuerySet object.
 */
export function child(nodeFilter) {
    return new QuerySet(_child(this, nodeFilter));
};

/**
 * Returns all children of each node (optionally matching a filter).
 * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
 * @param {{elementsOnly?: boolean}} [options] The filtering options.
 * @returns {QuerySet} The QuerySet object.
 */
export function children(nodeFilter, { elementsOnly = true } = {}) {
    return new QuerySet(_children(this, nodeFilter, { elementsOnly }));
};

/**
 * Returns the closest ancestor to each node (optionally matching a filter, and before a limit).
 * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
 * @param {NodeFilterInput} [limitFilter] The limit node(s), a query selector string or custom filter function.
 * @returns {QuerySet} The QuerySet object.
 */
export function closest(nodeFilter, limitFilter) {
    return new QuerySet(_closest(this, nodeFilter, limitFilter));
};

/**
 * Returns the common ancestor of all nodes.
 * @returns {QuerySet} The QuerySet object.
 */
export function commonAncestor() {
    const node = _commonAncestor(this);

    return new QuerySet(node ? [node] : []);
};

/**
 * Returns all children of each node (including text and comment nodes).
 * @returns {QuerySet} The QuerySet object.
 */
export function contents() {
    return new QuerySet(_contents(this));
};

/**
 * Returns the DocumentFragment of the first node.
 * @returns {QuerySet} The QuerySet object.
 */
export function fragment() {
    const node = _fragment(this);

    return new QuerySet(node ? [node] : []);
};

/**
 * Returns the next sibling for each node (optionally matching a filter).
 * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
 * @returns {QuerySet} The QuerySet object.
 */
export function next(nodeFilter) {
    return new QuerySet(_next(this, nodeFilter));
};

/**
 * Returns all next siblings for each node (optionally matching a filter, and before a limit).
 * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
 * @param {NodeFilterInput} [limitFilter] The limit node(s), a query selector string or custom filter function.
 * @returns {QuerySet} The QuerySet object.
 */
export function nextAll(nodeFilter, limitFilter) {
    return new QuerySet(_nextAll(this, nodeFilter, limitFilter));
};

/**
 * Returns the offset parent (relatively positioned) of the first node.
 * @returns {QuerySet} The QuerySet object.
 */
export function offsetParent() {
    const node = _offsetParent(this);

    return new QuerySet(node ? [node] : []);
};

/**
 * Returns the parent of each node (optionally matching a filter).
 * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
 * @returns {QuerySet} The QuerySet object.
 */
export function parent(nodeFilter) {
    return new QuerySet(_parent(this, nodeFilter));
};

/**
 * Returns all parents of each node (optionally matching a filter, and before a limit).
 * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
 * @param {NodeFilterInput} [limitFilter] The limit node(s), a query selector string or custom filter function.
 * @returns {QuerySet} The QuerySet object.
 */
export function parents(nodeFilter, limitFilter) {
    return new QuerySet(_parents(this, nodeFilter, limitFilter));
};

/**
 * Returns the previous sibling for each node (optionally matching a filter).
 * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
 * @returns {QuerySet} The QuerySet object.
 */
export function prev(nodeFilter) {
    return new QuerySet(_prev(this, nodeFilter));
};

/**
 * Returns all previous siblings for each node (optionally matching a filter, and before a limit).
 * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
 * @param {NodeFilterInput} [limitFilter] The limit node(s), a query selector string or custom filter function.
 * @returns {QuerySet} The QuerySet object.
 */
export function prevAll(nodeFilter, limitFilter) {
    return new QuerySet(_prevAll(this, nodeFilter, limitFilter));
};

/**
 * Returns the ShadowRoot of the first node.
 * @returns {QuerySet} The QuerySet object.
 */
export function shadow() {
    const node = _shadow(this);

    return new QuerySet(node ? [node] : []);
};

/**
 * Returns all siblings for each node (optionally matching a filter).
 * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
 * @param {{elementsOnly?: boolean}} [options] The filtering options.
 * @returns {QuerySet} The QuerySet object.
 */
export function siblings(nodeFilter, { elementsOnly = true } = {}) {
    return new QuerySet(_siblings(this, nodeFilter, { elementsOnly }));
};
