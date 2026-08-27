/** @import { NodeFilterInput } from '../../filters.js'; */
/** @import { NodeInput } from '../../helpers.js'; */
/** @import QuerySet from '../query-set.js'; */

import { hasAnimation as _hasAnimation, hasAttribute as _hasAttribute, hasChildren as _hasChildren, hasClass as _hasClass, hasCSSAnimation as _hasCSSAnimation, hasCSSTransition as _hasCSSTransition, hasData as _hasData, hasDataset as _hasDataset, hasDescendent as _hasDescendent, hasFragment as _hasFragment, hasProperty as _hasProperty, hasShadow as _hasShadow, is as _is, isConnected as _isConnected, isEqual as _isEqual, isFixed as _isFixed, isHidden as _isHidden, isSame as _isSame, isVisible as _isVisible } from './../../utility/tests.js';

/**
 * Checks whether any of the nodes has an animation.
 * @returns {boolean} Whether any of the nodes has an animation.
 */
export function hasAnimation() {
    return _hasAnimation(this);
};

/**
 * Checks whether any of the nodes has a specified attribute.
 * @param {string} attribute The attribute name.
 * @returns {boolean} Whether any of the nodes has the attribute.
 */
export function hasAttribute(attribute) {
    return _hasAttribute(this, attribute);
};

/**
 * Checks whether any of the nodes has child nodes.
 * @returns {boolean} Whether any of the nodes has child nodes.
 */
export function hasChildren() {
    return _hasChildren(this);
};

/**
 * Checks whether any of the nodes has any of the specified classes.
 * @param {...string|string[]} classes The classes.
 * @returns {boolean} Whether any of the nodes has any of the classes.
 */
export function hasClass(...classes) {
    return _hasClass(this, ...classes);
};

/**
 * Checks whether any of the nodes has a CSS animation.
 * @returns {boolean} Whether any of the nodes has a CSS animation.
 */
export function hasCSSAnimation() {
    return _hasCSSAnimation(this);
};

/**
 * Checks whether any of the nodes has a CSS transition.
 * @returns {boolean} Whether any of the nodes has a CSS transition.
 */
export function hasCSSTransition() {
    return _hasCSSTransition(this);
};

/**
 * Checks whether any of the nodes has custom data.
 * @param {string} [key] The data key.
 * @returns {boolean} Whether any of the nodes has custom data.
 */
export function hasData(key) {
    return _hasData(this, key);
};

/**
 * Checks whether any of the nodes has the specified dataset value.
 * @param {string} [key] The dataset key.
 * @returns {boolean} Whether any of the nodes has the dataset value.
 */
export function hasDataset(key) {
    return _hasDataset(this, key);
};

/**
 * Checks whether any of the nodes contains a descendant matching a filter.
 * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
 * @returns {boolean} Whether any of the nodes contains a descendant matching the filter.
 */
export function hasDescendent(nodeFilter) {
    return _hasDescendent(this, nodeFilter);
};

/**
 * Checks whether any of the nodes has a DocumentFragment.
 * @returns {boolean} Whether any of the nodes has a DocumentFragment.
 */
export function hasFragment() {
    return _hasFragment(this);
};

/**
 * Checks whether any of the nodes has a specified property.
 * @param {string} property The property name.
 * @returns {boolean} Whether any of the nodes has the property.
 */
export function hasProperty(property) {
    return _hasProperty(this, property);
};

/**
 * Checks whether any of the nodes has a ShadowRoot.
 * @returns {boolean} Whether any of the nodes has a ShadowRoot.
 */
export function hasShadow() {
    return _hasShadow(this);
};

/**
 * Checks whether any of the nodes matches a filter.
 * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
 * @returns {boolean} Whether any of the nodes matches the filter.
 */
export function is(nodeFilter) {
    return _is(this, nodeFilter);
};

/**
 * Checks whether any of the nodes is connected to the DOM.
 * @returns {boolean} Whether any of the nodes is connected to the DOM.
 */
export function isConnected() {
    return _isConnected(this);
};

/**
 * Checks whether any of the nodes is considered equal to any of the other nodes.
 * @param {NodeInput} otherSelector The other node(s), or a query selector string.
 * @param {{shallow?: boolean}} [options] The comparison options.
 * @returns {boolean} Whether any of the nodes is considered equal to any of the other nodes.
 */
export function isEqual(otherSelector, { shallow = false } = {}) {
    return _isEqual(this, otherSelector, { shallow });
};

/**
 * Checks whether any of the elements or a parent of any of the elements is "fixed".
 * @returns {boolean} Whether any of the nodes is "fixed".
 */
export function isFixed() {
    return _isFixed(this);
};

/**
 * Checks whether any of the nodes is hidden.
 * @returns {boolean} Whether any of the nodes is hidden.
 */
export function isHidden() {
    return _isHidden(this);
};

/**
 * Checks whether any of the nodes is considered identical to any of the other nodes.
 * @param {NodeInput} otherSelector The other node(s), or a query selector string.
 * @returns {boolean} Whether any of the nodes is considered identical to any of the other nodes.
 */
export function isSame(otherSelector) {
    return _isSame(this, otherSelector);
};

/**
 * Checks whether any of the nodes is visible.
 * @returns {boolean} Whether any of the nodes is visible.
 */
export function isVisible() {
    return _isVisible(this);
};
