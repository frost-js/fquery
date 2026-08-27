/** @import { NodeFilterInput } from '../filters.js'; */
/** @import { NodeInput } from '../helpers.js'; */

import { isDocument, isElement, merge, unique } from '@fr0st/core';
import { parseFilter, parseNode, parseNodes } from './../filters.js';
import { createRange } from './../manipulation/create.js';
import { sort } from './../utility/utility.js';

/**
 * Returns the first child of each node (optionally matching a filter).
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
 * @returns {Node[]} The matching nodes.
 */
export function child(selector, nodeFilter) {
    return children(selector, nodeFilter, { first: true });
};

/**
 * Returns all children of each node (optionally matching a filter).
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
 * @param {{first?: boolean, elementsOnly?: boolean}} [options] The filtering options.
 * @returns {Node[]} The matching nodes.
 */
export function children(selector, nodeFilter, { first = false, elementsOnly = true } = {}) {
    nodeFilter = parseFilter(nodeFilter);

    const nodes = parseNodes(selector, {
        fragment: true,
        shadow: true,
        document: true,
    });

    const results = [];

    for (const node of nodes) {
        const childNodes = elementsOnly ?
            merge([], node.children) :
            merge([], node.childNodes);

        for (const child of childNodes) {
            if (!nodeFilter(child)) {
                continue;
            }

            results.push(child);

            if (first) {
                break;
            }
        }
    }

    return nodes.length > 1 && results.length > 1 ?
        unique(results) :
        results;
};

/**
 * Returns the closest ancestor to each node (optionally matching a filter, and before a limit).
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
 * @param {NodeFilterInput} [limitFilter] The limit node(s), a query selector string or custom filter function.
 * @returns {Node[]} The matching nodes.
 */
export function closest(selector, nodeFilter, limitFilter) {
    return parents(selector, nodeFilter, limitFilter, { first: true });
};

/**
 * Returns the common ancestor of all nodes.
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @returns {Node|undefined} The common ancestor, or `undefined` if it cannot be resolved.
 */
export function commonAncestor(selector) {
    const nodes = sort(selector);

    if (!nodes.length) {
        return;
    }

    // Make sure all nodes have a parent
    if (nodes.some((node) => !node.parentNode)) {
        return;
    }

    const range = createRange();

    if (nodes.length === 1) {
        range.selectNode(nodes.shift());
    } else {
        range.setStartBefore(nodes.shift());
        range.setEndAfter(nodes.pop());
    }

    return range.commonAncestorContainer;
};

/**
 * Returns all children of each node (including text and comment nodes).
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @returns {Node[]} The matching nodes.
 */
export function contents(selector) {
    return children(selector, false, { elementsOnly: false });
};

/**
 * Returns the DocumentFragment of the first node.
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @returns {DocumentFragment|undefined} The DocumentFragment, or `undefined` if none exists.
 */
export function fragment(selector) {
    const node = parseNode(selector);

    if (!node) {
        return;
    }

    return node.content;
};

/**
 * Returns the next sibling for each node (optionally matching a filter).
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
 * @returns {Node[]} The matching nodes.
 */
export function next(selector, nodeFilter) {
    nodeFilter = parseFilter(nodeFilter);

    // DocumentFragment and ShadowRoot nodes can not have siblings
    const nodes = parseNodes(selector, {
        node: true,
    });

    const results = [];

    for (let node of nodes) {
        while (node = node.nextSibling) {
            if (!isElement(node)) {
                continue;
            }

            if (nodeFilter(node)) {
                results.push(node);
            }

            break;
        }
    }

    return nodes.length > 1 && results.length > 1 ?
        unique(results) :
        results;
};

/**
 * Returns all next siblings for each node (optionally matching a filter, and before a limit).
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
 * @param {NodeFilterInput} [limitFilter] The limit node(s), a query selector string or custom filter function.
 * @param {{first?: boolean}} [options] The filtering options.
 * @returns {Node[]} The matching nodes.
 */
export function nextAll(selector, nodeFilter, limitFilter, { first = false } = {}) {
    nodeFilter = parseFilter(nodeFilter);
    limitFilter = parseFilter(limitFilter, false);

    // DocumentFragment and ShadowRoot nodes can not have siblings
    const nodes = parseNodes(selector, {
        node: true,
    });

    const results = [];

    for (let node of nodes) {
        while (node = node.nextSibling) {
            if (!isElement(node)) {
                continue;
            }

            if (limitFilter(node)) {
                break;
            }

            if (!nodeFilter(node)) {
                continue;
            }

            results.push(node);

            if (first) {
                break;
            }
        }
    }

    return nodes.length > 1 && results.length > 1 ?
        unique(results) :
        results;
};

/**
 * Returns the offset parent (relatively positioned) of the first node.
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @returns {Element|null|undefined} The offset parent, or `undefined` if no node matches.
 */
export function offsetParent(selector) {
    const node = parseNode(selector);

    if (!node) {
        return;
    }

    return node.offsetParent;
};

/**
 * Returns the parent of each node (optionally matching a filter).
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
 * @returns {Node[]} The matching nodes.
 */
export function parent(selector, nodeFilter) {
    nodeFilter = parseFilter(nodeFilter);

    // DocumentFragment and ShadowRoot nodes have no parent
    const nodes = parseNodes(selector, {
        node: true,
    });

    const results = [];

    for (let node of nodes) {
        node = node.parentNode;

        if (!node) {
            continue;
        }

        if (!nodeFilter(node)) {
            continue;
        }

        results.push(node);
    }

    return nodes.length > 1 && results.length > 1 ?
        unique(results) :
        results;
};

/**
 * Returns all parents of each node (optionally matching a filter, and before a limit).
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
 * @param {NodeFilterInput} [limitFilter] The limit node(s), a query selector string or custom filter function.
 * @param {{first?: boolean}} [options] The filtering options.
 * @returns {Node[]} The matching nodes.
 */
export function parents(selector, nodeFilter, limitFilter, { first = false } = {}) {
    nodeFilter = parseFilter(nodeFilter);
    limitFilter = parseFilter(limitFilter, false);

    // DocumentFragment and ShadowRoot nodes have no parent
    const nodes = parseNodes(selector, {
        node: true,
    });

    const results = [];

    for (let node of nodes) {
        const parents = [];
        while (node = node.parentNode) {
            if (isDocument(node)) {
                break;
            }

            if (limitFilter(node)) {
                break;
            }

            if (!nodeFilter(node)) {
                continue;
            }

            parents.unshift(node);

            if (first) {
                break;
            }
        }

        results.push(...parents);
    }

    return nodes.length > 1 && results.length > 1 ?
        unique(results) :
        results;
};

/**
 * Returns the previous sibling for each node (optionally matching a filter).
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
 * @returns {Node[]} The matching nodes.
 */
export function prev(selector, nodeFilter) {
    nodeFilter = parseFilter(nodeFilter);

    // DocumentFragment and ShadowRoot nodes can not have siblings
    const nodes = parseNodes(selector, {
        node: true,
    });

    const results = [];

    for (let node of nodes) {
        while (node = node.previousSibling) {
            if (!isElement(node)) {
                continue;
            }

            if (nodeFilter(node)) {
                results.push(node);
            }

            break;
        }
    }

    return nodes.length > 1 && results.length > 1 ?
        unique(results) :
        results;
};

/**
 * Returns all previous siblings for each node (optionally matching a filter, and before a limit).
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
 * @param {NodeFilterInput} [limitFilter] The limit node(s), a query selector string or custom filter function.
 * @param {{first?: boolean}} [options] The filtering options.
 * @returns {Node[]} The matching nodes.
 */
export function prevAll(selector, nodeFilter, limitFilter, { first = false } = {}) {
    nodeFilter = parseFilter(nodeFilter);
    limitFilter = parseFilter(limitFilter, false);

    // DocumentFragment and ShadowRoot nodes can not have siblings
    const nodes = parseNodes(selector, {
        node: true,
    });

    const results = [];

    for (let node of nodes) {
        const siblings = [];
        while (node = node.previousSibling) {
            if (!isElement(node)) {
                continue;
            }

            if (limitFilter(node)) {
                break;
            }

            if (!nodeFilter(node)) {
                continue;
            }

            siblings.unshift(node);

            if (first) {
                break;
            }
        }

        results.push(...siblings);
    }

    return nodes.length > 1 && results.length > 1 ?
        unique(results) :
        results;
};

/**
 * Returns the ShadowRoot of the first node.
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @returns {ShadowRoot|null|undefined} The ShadowRoot, or `undefined` if no node matches.
 */
export function shadow(selector) {
    const node = parseNode(selector);

    if (!node) {
        return;
    }

    return node.shadowRoot;
};

/**
 * Returns all siblings for each node (optionally matching a filter).
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
 * @param {{elementsOnly?: boolean}} [options] The filtering options.
 * @returns {Node[]} The matching nodes.
 */
export function siblings(selector, nodeFilter, { elementsOnly = true } = {}) {
    nodeFilter = parseFilter(nodeFilter);

    // DocumentFragment and ShadowRoot nodes can not have siblings
    const nodes = parseNodes(selector, {
        node: true,
    });

    const results = [];

    for (const node of nodes) {
        const parent = node.parentNode;

        if (!parent) {
            continue;
        }

        const siblings = elementsOnly ?
            parent.children :
            parent.childNodes;

        let sibling;
        for (sibling of siblings) {
            if (node.isSameNode(sibling)) {
                continue;
            }

            if (!nodeFilter(sibling)) {
                continue;
            }

            results.push(sibling);
        }
    }

    return nodes.length > 1 && results.length > 1 ?
        unique(results) :
        results;
};
