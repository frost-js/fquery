/** @import { Coordinates } from '../../attributes/position.js'; */
/** @import { ElementInput } from '../../helpers.js'; */
/** @import { OffsetOptions } from '../../attributes/position.js'; */
/** @import { PercentOptions } from '../../attributes/position.js'; */

import { center as _center, constrain as _constrain, distTo as _distTo, distToNode as _distToNode, nearestTo as _nearestTo, nearestToNode as _nearestToNode, percentX as _percentX, percentY as _percentY, position as _position, rect as _rect } from './../../attributes/position.js';
import QuerySet from './../query-set-core.js';

/**
 * Gets the X,Y co-ordinates for the center of the first node.
 * @param {OffsetOptions} [options] The positioning options.
 * @returns {Coordinates|undefined} The center co-ordinates, or `undefined` if no element matches.
 */
export function center({ offset = false } = {}) {
    return _center(this, { offset });
};

/**
 * Constrains each node to a container node.
 * @param {ElementInput} container The container node, or a query selector string.
 * @returns {QuerySet} The QuerySet object.
 */
export function constrain(container) {
    _constrain(this, container);

    return this;
};

/**
 * Gets the distance of a node to an X,Y position in the Window.
 * @param {number} x The X co-ordinate.
 * @param {number} y The Y co-ordinate.
 * @param {OffsetOptions} [options] The positioning options.
 * @returns {number|undefined} The distance to the node, or `undefined` if no element matches.
 */
export function distTo(x, y, { offset = false } = {}) {
    return _distTo(this, x, y, { offset });
};

/**
 * Gets the distance between two nodes.
 * @param {ElementInput} otherSelector The node to compare, or a query selector string.
 * @returns {number|undefined} The distance between the nodes, or `undefined` if either element does not match.
 */
export function distToNode(otherSelector) {
    return _distToNode(this, otherSelector);
};

/**
 * Gets the nearest node to an X,Y position in the Window.
 * @param {number} x The X co-ordinate.
 * @param {number} y The Y co-ordinate.
 * @param {OffsetOptions} [options] The positioning options.
 * @returns {QuerySet} A new QuerySet object.
 */
export function nearestTo(x, y, { offset = false } = {}) {
    const node = _nearestTo(this, x, y, { offset });

    return new QuerySet(node ? [node] : []);
};

/**
 * Gets the nearest node to another node.
 * @param {ElementInput} otherSelector The node to compare, or a query selector string.
 * @returns {QuerySet} A new QuerySet object.
 */
export function nearestToNode(otherSelector) {
    const node = _nearestToNode(this, otherSelector);

    return new QuerySet(node ? [node] : []);
};

/**
 * Gets the percentage of an X co-ordinate relative to a node's width.
 * @param {number} x The X co-ordinate.
 * @param {PercentOptions} [options] The percentage options.
 * @returns {number|undefined} The percentage, or `undefined` if no element matches.
 */
export function percentX(x, { offset = false, clamp = true } = {}) {
    return _percentX(this, x, { offset, clamp });
};

/**
 * Gets the percentage of a Y co-ordinate relative to a node's height.
 * @param {number} y The Y co-ordinate.
 * @param {PercentOptions} [options] The percentage options.
 * @returns {number|undefined} The percentage, or `undefined` if no element matches.
 */
export function percentY(y, { offset = false, clamp = true } = {}) {
    return _percentY(this, y, { offset, clamp });
};

/**
 * Gets the position of the first node relative to the Window or Document.
 * @param {OffsetOptions} [options] The positioning options.
 * @returns {Coordinates|undefined} The co-ordinates, or `undefined` if no element matches.
 */
export function position({ offset = false } = {}) {
    return _position(this, { offset });
};

/**
 * Gets the computed bounding rectangle of the first node.
 * @param {OffsetOptions} [options] The positioning options.
 * @returns {DOMRect|undefined} The computed bounding rectangle, or `undefined` if no element matches.
 */
export function rect({ offset = false } = {}) {
    return _rect(this, { offset });
};
