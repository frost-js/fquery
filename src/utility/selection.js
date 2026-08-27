/** @import { NodeInput } from '../helpers.js'; */

import { isElement, merge, unique } from '@fr0st/core';
import { getWindow } from './../config.js';
import { parseNode, parseNodes } from './../filters.js';
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

    if (!selection.rangeCount) {
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

    if (!selection.rangeCount) {
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
    const commonAncestor = range.commonAncestorContainer;

    if (typeof commonAncestor.querySelectorAll !== 'function') {
        return [commonAncestor];
    }

    const nodes = merge([], commonAncestor.querySelectorAll('*'));

    if (!nodes.length) {
        return [commonAncestor];
    }

    if (nodes.length === 1) {
        return nodes;
    }

    const startContainer = range.startContainer;
    const endContainer = range.endContainer;
    const start = isElement(startContainer) ?
        startContainer :
        startContainer.parentNode;
    const end = isElement(endContainer) ?
        endContainer :
        endContainer.parentNode;

    const selectedNodes = nodes.slice(
        nodes.indexOf(start),
        nodes.indexOf(end) + 1,
    );
    const results = [];

    let lastNode;
    for (const node of selectedNodes) {
        if (lastNode && lastNode.contains(node)) {
            continue;
        }

        lastNode = node;
        results.push(node);
    }

    return results.length > 1 ?
        unique(results) :
        results;
};

/**
 * Creates a selection on the first node.
 * @param {NodeInput} selector The input node(s), or a query selector string.
 */
export function select(selector) {
    const node = parseNode(selector, {
        node: true,
    });

    if (node && 'select' in node) {
        node.select();
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
    const nodes = sort(selector);

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

    if (!selection.rangeCount) {
        return;
    }

    const range = selection.getRangeAt(0);

    selection.removeAllRanges();

    const node = nodes.slice().shift();
    const deepest = merge([], node.querySelectorAll('*')).find((node) => !node.childElementCount) || node;

    const fragment = range.extractContents();

    const childNodes = merge([], fragment.childNodes);

    for (const child of childNodes) {
        deepest.insertBefore(child, null);
    }

    for (const node of nodes) {
        range.insertNode(node);
    }
};
