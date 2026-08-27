/** @import { ElementInput } from '../helpers.js'; */
/** @import { NodeFilterInput } from '../filters.js'; */
/** @import { NodeInput } from '../helpers.js'; */
/** @import { QueryInput } from '../helpers.js'; */

import { isDocument, isElement, isWindow } from '@fr0st/core';
import { css } from './../attributes/styles.js';
import { parseFilter, parseFilterContains, parseNodes } from './../filters.js';
import { parseClasses } from './../helpers.js';
import { closest } from './../traversal/traversal.js';
import { animations, data } from './../vars.js';

/**
 * Returns all nodes connected to the DOM.
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @returns {Node[]} The filtered nodes.
 */
export function connected(selector) {
    return parseNodes(selector, {
        node: true,
        fragment: true,
        shadow: true,
    }).filter((node) => node.isConnected);
};

/**
 * Returns all nodes considered equal to any of the other nodes.
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @param {NodeInput} otherSelector The other node(s), or a query selector string.
 * @returns {Node[]} The filtered nodes.
 */
export function equal(selector, otherSelector) {
    const others = parseNodes(otherSelector, {
        node: true,
        fragment: true,
        shadow: true,
    });

    return parseNodes(selector, {
        node: true,
        fragment: true,
        shadow: true,
    }).filter((node) =>
        others.some((other) =>
            node.isEqualNode(other),
        ),
    );
};

/**
 * Returns all nodes matching a filter.
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
 * @returns {Node[]} The filtered nodes.
 */
export function filter(selector, nodeFilter) {
    nodeFilter = parseFilter(nodeFilter);

    return parseNodes(selector, {
        node: true,
        fragment: true,
        shadow: true,
    }).filter(nodeFilter);
};

/**
 * Returns the first node matching a filter.
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
 * @returns {Node|null} The matching node, or null when none matches.
 */
export function filterOne(selector, nodeFilter) {
    nodeFilter = parseFilter(nodeFilter);

    return parseNodes(selector, {
        node: true,
        fragment: true,
        shadow: true,
    }).find(nodeFilter) || null;
};

/**
 * Returns all "fixed" nodes.
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @returns {Node[]} The filtered nodes.
 */
export function fixed(selector) {
    return parseNodes(selector, {
        node: true,
    }).filter((node) =>
        (isElement(node) && css(node, 'position') === 'fixed') ||
        closest(
            node,
            (parent) => isElement(parent) && css(parent, 'position') === 'fixed',
        ).length,
    );
};

/**
 * Returns all hidden nodes.
 * @param {QueryInput} selector The input node(s), or a query selector string.
 * @returns {Array<Node|Window>} The filtered nodes.
 */
export function hidden(selector) {
    return parseNodes(selector, {
        node: true,
        document: true,
        window: true,
    }).filter((node) => {
        if (isWindow(node)) {
            return node.document.visibilityState !== 'visible';
        }

        if (isDocument(node)) {
            return node.visibilityState !== 'visible';
        }

        return !node.offsetParent;
    });
};

/**
 * Returns all nodes not matching a filter.
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
 * @returns {Node[]} The filtered nodes.
 */
export function not(selector, nodeFilter) {
    nodeFilter = parseFilter(nodeFilter);

    return parseNodes(selector, {
        node: true,
        fragment: true,
        shadow: true,
    }).filter((node, index) => !nodeFilter(node, index));
};

/**
 * Returns the first node not matching a filter.
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
 * @returns {Node|null} The matching node, or null when none matches.
 */
export function notOne(selector, nodeFilter) {
    nodeFilter = parseFilter(nodeFilter);

    return parseNodes(selector, {
        node: true,
        fragment: true,
        shadow: true,
    }).find((node, index) => !nodeFilter(node, index)) || null;
};

/**
 * Returns all nodes considered identical to any of the other nodes.
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @param {NodeInput} otherSelector The other node(s), or a query selector string.
 * @returns {Node[]} The filtered nodes.
 */
export function same(selector, otherSelector) {
    const others = parseNodes(otherSelector, {
        node: true,
        fragment: true,
        shadow: true,
    });

    return parseNodes(selector, {
        node: true,
        fragment: true,
        shadow: true,
    }).filter((node) =>
        others.some((other) =>
            node.isSameNode(other),
        ),
    );
};

/**
 * Returns all visible nodes.
 * @param {QueryInput} selector The input node(s), or a query selector string.
 * @returns {Array<Node|Window>} The filtered nodes.
 */
export function visible(selector) {
    return parseNodes(selector, {
        node: true,
        document: true,
        window: true,
    }).filter((node) => {
        if (isWindow(node)) {
            return node.document.visibilityState === 'visible';
        }

        if (isDocument(node)) {
            return node.visibilityState === 'visible';
        }

        return node.offsetParent;
    });
};

/**
 * Returns all nodes with an animation.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @returns {Node[]} The filtered nodes.
 */
export function withAnimation(selector) {
    return parseNodes(selector)
        .filter((node) =>
            animations.has(node),
        );
};

/**
 * Returns all nodes with a specified attribute.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {string} attribute The attribute name.
 * @returns {Node[]} The filtered nodes.
 */
export function withAttribute(selector, attribute) {
    return parseNodes(selector)
        .filter((node) =>
            node.hasAttribute(attribute),
        );
};

/**
 * Returns all nodes with child elements.
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @returns {Node[]} The filtered nodes.
 */
export function withChildren(selector) {
    return parseNodes(selector, {
        fragment: true,
        shadow: true,
        document: true,
    }).filter((node) =>
        !!node.childElementCount,
    );
};

/**
 * Returns all nodes with any of the specified classes.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {...string|string[]} classes The classes.
 * @returns {Node[]} The filtered nodes.
 */
export function withClass(selector, ...classes) {
    classes = parseClasses(classes);

    return parseNodes(selector)
        .filter((node) =>
            classes.some((className) =>
                node.classList.contains(className),
            ),
        );
};

/**
 * Returns all nodes with a CSS animation.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @returns {Node[]} The filtered nodes.
 */
export function withCSSAnimation(selector) {
    return parseNodes(selector)
        .filter((node) =>
            parseFloat(css(node, 'animation-duration')),
        );
};

/**
 * Returns all nodes with a CSS transition.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @returns {Node[]} The filtered nodes.
 */
export function withCSSTransition(selector) {
    return parseNodes(selector)
        .filter((node) =>
            parseFloat(css(node, 'transition-duration')),
        );
};

/**
 * Returns all nodes with custom data.
 * @param {QueryInput} selector The input node(s), or a query selector string.
 * @param {string} [key] The data key.
 * @returns {Array<Node|Window>} The filtered nodes.
 */
export function withData(selector, key) {
    return parseNodes(selector, {
        node: true,
        fragment: true,
        shadow: true,
        document: true,
        window: true,
    }).filter((node) => {
        if (!data.has(node)) {
            return false;
        }

        if (!key) {
            return true;
        }

        const nodeData = data.get(node);

        return Object.hasOwn(nodeData, key);
    });
};

/**
 * Returns all nodes with a descendant matching a filter.
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
 * @returns {Node[]} The filtered nodes.
 */
export function withDescendent(selector, nodeFilter) {
    nodeFilter = parseFilterContains(nodeFilter);

    return parseNodes(selector, {
        fragment: true,
        shadow: true,
        document: true,
    }).filter(nodeFilter);
};

/**
 * Returns all nodes with a specified property.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {string} property The property name.
 * @returns {Node[]} The filtered nodes.
 */
export function withProperty(selector, property) {
    return parseNodes(selector)
        .filter((node) =>
            Object.hasOwn(node, property),
        );
};
