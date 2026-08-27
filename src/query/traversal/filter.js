/** @import { NodeFilterInput } from '../../filters.js'; */
/** @import { NodeInput } from '../../helpers.js'; */

import { connected as _connected, equal as _equal, filter as _filter, filterOne as _filterOne, fixed as _fixed, hidden as _hidden, not as _not, notOne as _notOne, same as _same, visible as _visible, withAnimation as _withAnimation, withAttribute as _withAttribute, withChildren as _withChildren, withClass as _withClass, withCSSAnimation as _withCSSAnimation, withCSSTransition as _withCSSTransition, withData as _withData, withDescendent as _withDescendent, withProperty as _withProperty } from './../../traversal/filter.js';
import QuerySet from './../query-set-core.js';

/**
 * Returns all nodes connected to the DOM.
 * @returns {QuerySet} The QuerySet object.
 */
export function connected() {
    return new QuerySet(_connected(this));
};

/**
 * Returns all nodes considered equal to any of the other nodes.
 * @param {NodeInput} otherSelector The other node(s), or a query selector string.
 * @returns {QuerySet} The QuerySet object.
 */
export function equal(otherSelector) {
    return new QuerySet(_equal(this, otherSelector));
};

/**
 * Returns all nodes matching a filter.
 * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
 * @returns {QuerySet} The QuerySet object.
 */
export function filter(nodeFilter) {
    return new QuerySet(_filter(this, nodeFilter));
};

/**
 * Returns the first node matching a filter.
 * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
 * @returns {QuerySet} The QuerySet object.
 */
export function filterOne(nodeFilter) {
    const node = _filterOne(this, nodeFilter);

    return new QuerySet(node ? [node] : []);
};

/**
 * Returns all "fixed" nodes.
 * @returns {QuerySet} The QuerySet object.
 */
export function fixed() {
    return new QuerySet(_fixed(this));
};

/**
 * Returns all hidden nodes.
 * @returns {QuerySet} The QuerySet object.
 */
export function hidden() {
    return new QuerySet(_hidden(this));
};

/**
 * Returns all nodes not matching a filter.
 * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
 * @returns {QuerySet} The QuerySet object.
 */
export function not(nodeFilter) {
    return new QuerySet(_not(this, nodeFilter));
};

/**
 * Returns the first node not matching a filter.
 * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
 * @returns {QuerySet} The QuerySet object.
 */
export function notOne(nodeFilter) {
    const node = _notOne(this, nodeFilter);

    return new QuerySet(node ? [node] : []);
};

/**
 * Returns all nodes considered identical to any of the other nodes.
 * @param {NodeInput} otherSelector The other node(s), or a query selector string.
 * @returns {QuerySet} The QuerySet object.
 */
export function same(otherSelector) {
    return new QuerySet(_same(this, otherSelector));
};

/**
 * Returns all visible nodes.
 * @returns {QuerySet} The QuerySet object.
 */
export function visible() {
    return new QuerySet(_visible(this));
};

/**
 * Returns all nodes with an animation.
 * @returns {QuerySet} The QuerySet object.
 */
export function withAnimation() {
    return new QuerySet(_withAnimation(this));
};

/**
 * Returns all nodes with a specified attribute.
 * @param {string} attribute The attribute name.
 * @returns {QuerySet} The QuerySet object.
 */
export function withAttribute(attribute) {
    return new QuerySet(_withAttribute(this, attribute));
};

/**
 * Returns all nodes with child elements.
 * @returns {QuerySet} The QuerySet object.
 */
export function withChildren() {
    return new QuerySet(_withChildren(this));
};

/**
 * Returns all nodes with any of the specified classes.
 * @param {...string|string[]} classes The classes.
 * @returns {QuerySet} The QuerySet object.
 */
export function withClass(...classes) {
    return new QuerySet(_withClass(this, ...classes));
};

/**
 * Returns all nodes with a CSS animation.
 * @returns {QuerySet} The QuerySet object.
 */
export function withCSSAnimation() {
    return new QuerySet(_withCSSAnimation(this));
};

/**
 * Returns all nodes with a CSS transition.
 * @returns {QuerySet} The QuerySet object.
 */
export function withCSSTransition() {
    return new QuerySet(_withCSSTransition(this));
};

/**
 * Returns all nodes with custom data.
 * @param {string} [key] The data key.
 * @returns {QuerySet} The QuerySet object.
 */
export function withData(key) {
    return new QuerySet(_withData(this, key));
};

/**
 * Returns all elements with a descendant matching a filter.
 * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
 * @returns {QuerySet} The QuerySet object.
 */
export function withDescendent(nodeFilter) {
    return new QuerySet(_withDescendent(this, nodeFilter));
};

/**
 * Returns all nodes with a specified property.
 * @param {string} property The property name.
 * @returns {QuerySet} The QuerySet object.
 */
export function withProperty(property) {
    return new QuerySet(_withProperty(this, property));
};
