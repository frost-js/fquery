/** @import QuerySet from '../query-set.js'; */
/** @import { ReleaseStyleLock } from '../../attributes/style-locks.js'; */
/** @import { StyleValues } from '../../attributes/styles.js'; */

import { setStyleLock as _setStyleLock } from '../../attributes/style-locks.js';
import { addClass as _addClass, css as _css, getStyle as _getStyle, hide as _hide, removeClass as _removeClass, removeStyle as _removeStyle, setStyle as _setStyle, show as _show, toggle as _toggle, toggleClass as _toggleClass } from '../../attributes/styles.js';

/**
 * Adds classes to each node.
 * @param {...string|string[]} classes The classes.
 * @returns {QuerySet} The QuerySet object.
 */
export function addClass(...classes) {
    _addClass(this, ...classes);

    return this;
}

/**
 * Gets computed CSS style values for the first node.
 * @param {string} [style] The CSS style name.
 * @returns {string|Record<string, string>|undefined} The CSS style value, all computed styles, or `undefined` if no element matches.
 */
export function css(style) {
    return _css(this, style);
}

/**
 * Gets style properties for the first node.
 * @param {string} [style] The style name.
 * @returns {string|Record<string, string>|undefined} The style value, all inline styles, or `undefined` if no element matches.
 */
export function getStyle(style) {
    return _getStyle(this, style);
}

/**
 * Hides each node from display.
 * @returns {QuerySet} The QuerySet object.
 */
export function hide() {
    _hide(this);

    return this;
}

/**
 * Removes classes from each node.
 * @param {...string|string[]} classes The classes.
 * @returns {QuerySet} The QuerySet object.
 */
export function removeClass(...classes) {
    _removeClass(this, ...classes);

    return this;
}

/**
 * Removes a style property from each node.
 * @param {string} style The style name.
 * @returns {QuerySet} The QuerySet object.
 */
export function removeStyle(style) {
    _removeStyle(this, style);

    return this;
}

/**
 * Sets style properties for each node.
 * @param {string|StyleValues} style The style name, or an object containing styles.
 * @param {string|number} [value] The style value.
 * @param {{important?: boolean}} [options] The style options.
 * @returns {QuerySet} The QuerySet object.
 */
export function setStyle(style, value, { important = false } = {}) {
    _setStyle(this, style, value, { important });

    return this;
}

/**
 * Temporarily sets and locks one inline style property for each node.
 * @param {string} property The longhand or custom property name. Shorthands and aliases are not supported.
 * @param {string|number} value The temporary style value.
 * @param {{important?: boolean}} [options] The style options.
 * @returns {ReleaseStyleLock} A function that releases the locks, restoring the original declarations unless restore is false. Repeated calls do nothing.
 * @throws {Error} When the property or value is unsupported, an original value cannot be restored, or any matching node already has a lock for the property.
 */
export function setStyleLock(property, value, { important = false } = {}) {
    return _setStyleLock(this, property, value, { important });
}

/**
 * Displays each hidden node.
 * @returns {QuerySet} The QuerySet object.
 */
export function show() {
    _show(this);

    return this;
}

/**
 * Toggles the visibility of each node.
 * @param {boolean} [force] Whether to show or hide. Omit to toggle the current state.
 * @returns {QuerySet} The QuerySet object.
 */
export function toggle(force) {
    _toggle(this, force);

    return this;
}

/**
 * Toggles classes for each node.
 * @param {...string|string[]} classes The classes.
 * @returns {QuerySet} The QuerySet object.
 */
export function toggleClass(...classes) {
    _toggleClass(this, ...classes);

    return this;
}
