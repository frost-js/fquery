/** @import { ElementInput } from '../helpers.js'; */

import { clampPercent, dist } from '@fr0st/core';
import { getContext, getWindow } from './../config.js';
import { parseNode, parseNodes } from './../filters.js';
import { css } from './styles.js';

/**
 * @typedef {object} Coordinates
 * @property {number} x The X co-ordinate.
 * @property {number} y The Y co-ordinate.
 */

/**
 * @typedef {object} OffsetOptions
 * @property {boolean} [offset=false] Whether to offset from the top-left of the Document.
 */

/**
 * @typedef {OffsetOptions & {clamp?: boolean}} PercentOptions
 */

/**
 * Gets the X,Y co-ordinates for the center of the first node.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {OffsetOptions} [options] The positioning options.
 * @returns {Coordinates|undefined} The center co-ordinates, or `undefined` if no element matches.
 */
export function center(selector, { offset = false } = {}) {
    const nodeBox = rect(selector, { offset });

    if (!nodeBox) {
        return;
    }

    return {
        x: nodeBox.left + nodeBox.width / 2,
        y: nodeBox.top + nodeBox.height / 2,
    };
};

/**
 * Constrains each node to a container node.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {ElementInput} containerSelector The container node, or a query selector string.
 */
export function constrain(selector, containerSelector) {
    const containerBox = rect(containerSelector);

    if (!containerBox) {
        return;
    }

    const nodes = parseNodes(selector);

    const context = getContext();
    const window = getWindow();
    const getScrollX = (_) => context.documentElement.scrollHeight > window.outerHeight;
    const getScrollY = (_) => context.documentElement.scrollWidth > window.outerWidth;

    const preScrollX = getScrollX();
    const preScrollY = getScrollY();

    for (const node of nodes) {
        let nodeBox = rect(node);
        let resized = false;

        if (nodeBox.height > containerBox.height) {
            node.style.setProperty('height', `${containerBox.height}px`);
            resized = true;
        }

        if (nodeBox.width > containerBox.width) {
            node.style.setProperty('width', `${containerBox.width}px`);
            resized = true;
        }

        if (resized) {
            nodeBox = rect(node);
        }

        let leftOffset;
        if (nodeBox.left - containerBox.left < 0) {
            leftOffset = nodeBox.left - containerBox.left;
        } else if (nodeBox.right - containerBox.right > 0) {
            leftOffset = nodeBox.right - containerBox.right;
        }

        if (leftOffset) {
            const oldLeft = css(node, 'left');
            const trueLeft = oldLeft && oldLeft !== 'auto' ? parseFloat(oldLeft) : 0;
            node.style.setProperty('left', `${trueLeft - leftOffset}px`);
        }

        let topOffset;
        if (nodeBox.top - containerBox.top < 0) {
            topOffset = nodeBox.top - containerBox.top;
        } else if (nodeBox.bottom - containerBox.bottom > 0) {
            topOffset = nodeBox.bottom - containerBox.bottom;
        }

        if (topOffset) {
            const oldTop = css(node, 'top');
            const trueTop = oldTop && oldTop !== 'auto' ? parseFloat(oldTop) : 0;
            node.style.setProperty('top', `${trueTop - topOffset}px`);
        }

        if (css(node, 'position') === 'static') {
            node.style.setProperty('position', 'relative');
        }
    }

    const postScrollX = getScrollX();
    const postScrollY = getScrollY();

    if (preScrollX !== postScrollX || preScrollY !== postScrollY) {
        constrain(nodes, containerSelector);
    }
};

/**
 * Gets the distance of a node to an X,Y position in the Window.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {number} x The X co-ordinate.
 * @param {number} y The Y co-ordinate.
 * @param {OffsetOptions} [options] The positioning options.
 * @returns {number|undefined} The distance to the element, or `undefined` if no element matches.
 */
export function distTo(selector, x, y, { offset = false } = {}) {
    const nodeCenter = center(selector, { offset });

    if (!nodeCenter) {
        return;
    }

    return dist(nodeCenter.x, nodeCenter.y, x, y);
};

/**
 * Gets the distance between two nodes.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {ElementInput} otherSelector The node to compare, or a query selector string.
 * @returns {number|undefined} The distance between the nodes, or `undefined` if either element does not match.
 */
export function distToNode(selector, otherSelector) {
    const otherCenter = center(otherSelector);

    if (!otherCenter) {
        return;
    }

    return distTo(selector, otherCenter.x, otherCenter.y);
};

/**
 * Gets the nearest node to an X,Y position in the Window.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {number} x The X co-ordinate.
 * @param {number} y The Y co-ordinate.
 * @param {OffsetOptions} [options] The positioning options.
 * @returns {Element|undefined} The nearest element, or `undefined` if none matches.
 */
export function nearestTo(selector, x, y, { offset = false } = {}) {
    let closest;
    let closestDistance = Number.MAX_VALUE;

    const nodes = parseNodes(selector);

    for (const node of nodes) {
        const dist = distTo(node, x, y, { offset });
        if (dist < closestDistance) {
            closestDistance = dist;
            closest = node;
        }
    }

    return closest;
};

/**
 * Gets the nearest node to another node.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {ElementInput} otherSelector The node to compare, or a query selector string.
 * @returns {Element|undefined} The nearest element, or `undefined` if none matches.
 */
export function nearestToNode(selector, otherSelector) {
    const otherCenter = center(otherSelector);

    if (!otherCenter) {
        return;
    }

    return nearestTo(selector, otherCenter.x, otherCenter.y);
};

/**
 * Gets the percentage of an X co-ordinate relative to a node's width.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {number} x The X co-ordinate.
 * @param {PercentOptions} [options] The percentage options.
 * @returns {number|undefined} The percentage, or `undefined` if no element matches.
 */
export function percentX(selector, x, { offset = false, clamp = true } = {}) {
    const nodeBox = rect(selector, { offset });

    if (!nodeBox) {
        return;
    }

    const percent = (x - nodeBox.left) /
        nodeBox.width *
        100;

    return clamp ?
        clampPercent(percent) :
        percent;
};

/**
 * Gets the percentage of a Y co-ordinate relative to a node's height.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {number} y The Y co-ordinate.
 * @param {PercentOptions} [options] The percentage options.
 * @returns {number|undefined} The percentage, or `undefined` if no element matches.
 */
export function percentY(selector, y, { offset = false, clamp = true } = {}) {
    const nodeBox = rect(selector, { offset });

    if (!nodeBox) {
        return;
    }

    const percent = (y - nodeBox.top) /
        nodeBox.height *
        100;

    return clamp ?
        clampPercent(percent) :
        percent;
};

/**
 * Gets the position of the first node relative to the Window or Document.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {OffsetOptions} [options] The positioning options.
 * @returns {Coordinates|undefined} The co-ordinates, or `undefined` if no element matches.
 */
export function position(selector, { offset = false } = {}) {
    const node = parseNode(selector);

    if (!node) {
        return;
    }

    const result = {
        x: node.offsetLeft,
        y: node.offsetTop,
    };

    if (offset) {
        let offsetParent = node;

        while (offsetParent = offsetParent.offsetParent) {
            result.x += offsetParent.offsetLeft;
            result.y += offsetParent.offsetTop;
        }
    }

    return result;
};

/**
 * Gets the computed bounding rectangle of the first node.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {OffsetOptions} [options] The positioning options.
 * @returns {DOMRect|undefined} The computed bounding rectangle, or `undefined` if no element matches.
 */
export function rect(selector, { offset = false } = {}) {
    const node = parseNode(selector);

    if (!node) {
        return;
    }

    const result = node.getBoundingClientRect();

    if (offset) {
        const window = getWindow();
        result.x += window.scrollX;
        result.y += window.scrollY;
    }

    return result;
};
