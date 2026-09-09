/** @import { NodeInput } from '../helpers.js'; */

import { callDOMMethod, getDOMProperty, merge } from '@fr0st/core';
import { getWindow } from './../config.js';
import { parseNode, parseNodes } from './../filters.js';
import { getWrapTarget } from './../helpers.js';
import { createRange } from './../manipulation/create.js';
import { sort } from './utility.js';

/**
 * Inserts each node after the selection.
 * @param {NodeInput} selector The input node(s), or a query selector or HTML string.
 */
export function afterSelection(selector) {
    // ShadowRoot nodes can not be moved
    const nodes = parseNodes(selector, {
        node: true,
        fragment: true,
        html: true,
    }).reverse();

    const selection = getWindow().getSelection();

    if (!nodes.length || !selection.rangeCount) {
        return;
    }

    const range = selection.getRangeAt(0);

    selection.removeAllRanges();
    range.collapse();

    for (const node of nodes) {
        range.insertNode(node);
    }
};

/**
 * Inserts each node before the selection.
 * @param {NodeInput} selector The input node(s), or a query selector or HTML string.
 */
export function beforeSelection(selector) {
    // ShadowRoot nodes can not be moved
    const nodes = parseNodes(selector, {
        node: true,
        fragment: true,
        html: true,
    }).reverse();

    const selection = getWindow().getSelection();

    if (!nodes.length || !selection.rangeCount) {
        return;
    }

    const range = selection.getRangeAt(0);

    selection.removeAllRanges();

    for (const node of nodes) {
        range.insertNode(node);
    }
};

/**
 * Extracts selected nodes from the DOM.
 * @returns {Node[]} The selected nodes.
 */
export function extractSelection() {
    const selection = getWindow().getSelection();

    if (!selection.rangeCount) {
        return [];
    }

    const range = selection.getRangeAt(0);

    selection.removeAllRanges();

    const fragment = range.extractContents();

    return merge([], fragment.childNodes);
};

/**
 * Returns all selected nodes.
 * @returns {Node[]} The selected nodes.
 */
export function getSelection() {
    const selection = getWindow().getSelection();

    if (!selection.rangeCount) {
        return [];
    }

    const range = selection.getRangeAt(0);

    if (range.collapsed) {
        return [];
    }

    const commonAncestor = range.commonAncestorContainer;
    const nodes = merge([], getDOMProperty(commonAncestor, 'childNodes'));

    if (!nodes.length) {
        return [commonAncestor];
    }

    return nodes.filter((node) => range.intersectsNode(node));
};

/**
 * Creates a selection on the first node.
 * @param {NodeInput} selector The input node(s), or a query selector string.
 */
export function select(selector) {
    const node = parseNode(selector, {
        node: true,
    });

    const select = node && getDOMProperty(node, 'select');

    if (typeof select === 'function') {
        select.call(node);
        return;
    }

    const selection = getWindow().getSelection();

    if (selection.rangeCount > 0) {
        selection.removeAllRanges();
    }

    if (!node) {
        return;
    }

    const range = createRange();
    range.selectNode(node);
    selection.addRange(range);
};

/**
 * Creates a selection containing all of the nodes.
 * @param {NodeInput} selector The input node(s), or a query selector string.
 */
export function selectAll(selector) {
    let nodes = sort(selector);

    nodes = nodes.filter((node) =>
        !nodes.some((other) =>
            other !== node && callDOMMethod(other, 'contains', node),
        ),
    );

    const selection = getWindow().getSelection();

    if (selection.rangeCount) {
        selection.removeAllRanges();
    }

    if (!nodes.length) {
        return;
    }

    const range = createRange();

    if (nodes.length == 1) {
        range.selectNode(nodes.shift());
    } else {
        range.setStartBefore(nodes.shift());
        range.setEndAfter(nodes.pop());
    }

    selection.addRange(range);
};

/**
 * Wraps selected nodes with other nodes.
 * @param {NodeInput} selector The input node(s), or a query selector or HTML string.
 */
export function wrapSelection(selector) {
    // ShadowRoot nodes can not be cloned
    const nodes = parseNodes(selector, {
        fragment: true,
        html: true,
    });

    const selection = getWindow().getSelection();

    if (!nodes.length || !selection.rangeCount) {
        return;
    }

    const range = selection.getRangeAt(0);

    selection.removeAllRanges();

    const deepest = getWrapTarget(nodes[0]);

    const fragment = range.extractContents();

    const childNodes = merge([], fragment.childNodes);

    for (const child of childNodes) {
        callDOMMethod(deepest, 'insertBefore', child, null);
    }

    for (const node of nodes.reverse()) {
        range.insertNode(node);
    }
};
