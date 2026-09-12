/** @import { NodeFilterInput } from '../filters.js'; */
/** @import { NodeInput } from '../helpers.js'; */

import { callDomMethod, getDomProperty, isFragment, merge } from '@fr0st/core';
import { parseFilter, parseNodes } from './../filters.js';
import { getWrapTarget } from './../helpers.js';
import { clone, remove } from './manipulation.js';

/**
 * Unwraps each node.
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
 */
export function unwrap(selector, nodeFilter) {
    // DocumentFragment and ShadowRoot nodes can not be unwrapped
    const nodes = parseNodes(selector, {
        node: true,
    });

    nodeFilter = parseFilter(nodeFilter);

    const parents = [];

    for (const node of nodes) {
        const parent = getDomProperty(node, 'parentNode');

        if (!parent || !getDomProperty(parent, 'parentNode')) {
            continue;
        }

        if (parents.includes(parent)) {
            continue;
        }

        if (!nodeFilter(parent)) {
            continue;
        }

        parents.push(parent);
    }

    for (const parent of parents) {
        const outerParent = getDomProperty(parent, 'parentNode');

        if (!outerParent) {
            continue;
        }

        const children = merge([], getDomProperty(parent, 'childNodes'));

        for (const child of children) {
            callDomMethod(outerParent, 'insertBefore', child, parent);
        }
    }

    remove(parents);
};

/**
 * Wraps each nodes with other nodes.
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @param {NodeInput} otherSelector The other node(s), or a query selector or HTML string.
 */
export function wrap(selector, otherSelector) {
    // DocumentFragment and ShadowRoot nodes can not be wrapped
    const nodes = parseNodes(selector, {
        node: true,
    });

    // ShadowRoot nodes can not be cloned
    const others = parseNodes(otherSelector, {
        fragment: true,
        html: true,
    });

    for (const node of nodes) {
        const parent = getDomProperty(node, 'parentNode');

        if (!parent) {
            continue;
        }

        const clones = clone(others, {
            events: true,
            data: true,
            animations: true,
        });

        const firstClone = clones[0];

        const firstCloneNode = isFragment(firstClone) ?
            getDomProperty(firstClone, 'firstElementChild') :
            firstClone;

        if (!firstCloneNode) {
            continue;
        }

        const deepest = getWrapTarget(firstCloneNode);

        for (const clone of clones) {
            callDomMethod(parent, 'insertBefore', clone, node);
        }

        callDomMethod(deepest, 'insertBefore', node, null);
    }
};

/**
 * Wraps all nodes with other nodes.
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @param {NodeInput} otherSelector The other node(s), or a query selector or HTML string.
 */
export function wrapAll(selector, otherSelector) {
    // DocumentFragment and ShadowRoot nodes can not be wrapped
    const nodes = parseNodes(selector, {
        node: true,
    });

    // ShadowRoot nodes can not be cloned
    const others = parseNodes(otherSelector, {
        fragment: true,
        html: true,
    });

    const clones = clone(others, {
        events: true,
        data: true,
        animations: true,
    });

    const firstNode = nodes[0];

    if (!firstNode) {
        return;
    }

    const parent = getDomProperty(firstNode, 'parentNode');

    if (!parent) {
        return;
    }

    const firstClone = clones[0];

    const firstCloneNode = isFragment(firstClone) ?
        getDomProperty(firstClone, 'firstElementChild') :
        firstClone;

    if (!firstCloneNode) {
        return;
    }

    const deepest = getWrapTarget(firstCloneNode);

    for (const clone of clones) {
        callDomMethod(parent, 'insertBefore', clone, firstNode);
    }

    for (const node of nodes) {
        callDomMethod(deepest, 'insertBefore', node, null);
    }
};

/**
 * Wraps the contents of each node with other nodes.
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @param {NodeInput} otherSelector The other node(s), or a query selector or HTML string.
 */
export function wrapInner(selector, otherSelector) {
    const nodes = parseNodes(selector, {
        node: true,
        fragment: true,
        shadow: true,
    });

    // ShadowRoot nodes can not be cloned
    const others = parseNodes(otherSelector, {
        fragment: true,
        html: true,
    });

    for (const node of nodes) {
        const children = merge([], getDomProperty(node, 'childNodes'));

        const clones = clone(others, {
            events: true,
            data: true,
            animations: true,
        });

        const firstClone = clones[0];

        const firstCloneNode = isFragment(firstClone) ?
            getDomProperty(firstClone, 'firstElementChild') :
            firstClone;

        if (!firstCloneNode) {
            continue;
        }

        const deepest = getWrapTarget(firstCloneNode);

        for (const clone of clones) {
            callDomMethod(node, 'insertBefore', clone, null);
        }

        for (const child of children) {
            callDomMethod(deepest, 'insertBefore', child, null);
        }
    }
};
