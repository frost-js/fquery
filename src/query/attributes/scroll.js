/** @import QuerySet from '../query-set.js'; */

import { getScrollX as _getScrollX, getScrollY as _getScrollY, setScroll as _setScroll, setScrollX as _setScrollX, setScrollY as _setScrollY } from './../../attributes/scroll.js';

/**
 * Gets the scroll X position of the first node.
 * @returns {number|undefined} The scroll X position, or `undefined` if no node matches.
 */
export function getScrollX() {
    return _getScrollX(this);
};

/**
 * Gets the scroll Y position of the first node.
 * @returns {number|undefined} The scroll Y position, or `undefined` if no node matches.
 */
export function getScrollY() {
    return _getScrollY(this);
};

/**
 * Scrolls each node to an X,Y position.
 * @param {number} x The scroll X position.
 * @param {number} y The scroll Y position.
 * @returns {QuerySet} The QuerySet object.
 */
export function setScroll(x, y) {
    _setScroll(this, x, y);

    return this;
};

/**
 * Scrolls each node to an X position.
 * @param {number} x The scroll X position.
 * @returns {QuerySet} The QuerySet object.
 */
export function setScrollX(x) {
    _setScrollX(this, x);

    return this;
};

/**
 * Scrolls each node to a Y position.
 * @param {number} y The scroll Y position.
 * @returns {QuerySet} The QuerySet object.
 */
export function setScrollY(y) {
    _setScrollY(this, y);

    return this;
};
