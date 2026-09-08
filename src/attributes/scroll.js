/** @import { QueryInput } from '../helpers.js'; */

import { getDOMProperty, isDocument, isWindow } from '@fr0st/core';
import { parseNode, parseNodes } from './../filters.js';

/**
 * Gets the scroll X position of the first node.
 * @param {QueryInput} selector The input node(s), or a query selector string.
 * @returns {number|undefined} The scroll X position, or `undefined` if no node matches.
 */
export function getScrollX(selector) {
    const node = parseNode(selector, {
        document: true,
        window: true,
    });

    if (!node) {
        return;
    }

    if (isWindow(node)) {
        return node.scrollX;
    }

    if (isDocument(node)) {
        const scrollingElement = getDOMProperty(node, 'scrollingElement');
        return getDOMProperty(scrollingElement, 'scrollLeft');
    }

    return getDOMProperty(node, 'scrollLeft');
};

/**
 * Gets the scroll Y position of the first node.
 * @param {QueryInput} selector The input node(s), or a query selector string.
 * @returns {number|undefined} The scroll Y position, or `undefined` if no node matches.
 */
export function getScrollY(selector) {
    const node = parseNode(selector, {
        document: true,
        window: true,
    });

    if (!node) {
        return;
    }

    if (isWindow(node)) {
        return node.scrollY;
    }

    if (isDocument(node)) {
        const scrollingElement = getDOMProperty(node, 'scrollingElement');
        return getDOMProperty(scrollingElement, 'scrollTop');
    }

    return getDOMProperty(node, 'scrollTop');
};

/**
 * Scrolls each node to an X,Y position.
 * @param {QueryInput} selector The input node(s), or a query selector string.
 * @param {number} x The scroll X position.
 * @param {number} y The scroll Y position.
 */
export function setScroll(selector, x, y) {
    const nodes = parseNodes(selector, {
        document: true,
        window: true,
    });

    for (const node of nodes) {
        if (isWindow(node)) {
            node.scroll(x, y);
        } else if (isDocument(node)) {
            getDOMProperty(node, 'scrollingElement').scrollLeft = x;
            getDOMProperty(node, 'scrollingElement').scrollTop = y;
        } else {
            node.scrollLeft = x;
            node.scrollTop = y;
        }
    }
};

/**
 * Scrolls each node to an X position.
 * @param {QueryInput} selector The input node(s), or a query selector string.
 * @param {number} x The scroll X position.
 */
export function setScrollX(selector, x) {
    const nodes = parseNodes(selector, {
        document: true,
        window: true,
    });

    for (const node of nodes) {
        if (isWindow(node)) {
            node.scroll(x, node.scrollY);
        } else if (isDocument(node)) {
            getDOMProperty(node, 'scrollingElement').scrollLeft = x;
        } else {
            node.scrollLeft = x;
        }
    }
};

/**
 * Scrolls each node to a Y position.
 * @param {QueryInput} selector The input node(s), or a query selector string.
 * @param {number} y The scroll Y position.
 */
export function setScrollY(selector, y) {
    const nodes = parseNodes(selector, {
        document: true,
        window: true,
    });

    for (const node of nodes) {
        if (isWindow(node)) {
            node.scroll(node.scrollX, y);
        } else if (isDocument(node)) {
            getDOMProperty(node, 'scrollingElement').scrollTop = y;
        } else {
            node.scrollTop = y;
        }
    }
};
