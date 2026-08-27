/** @import { ElementInput } from '../helpers.js'; */
/** @import { NodeFilterInput } from '../filters.js'; */
/** @import { NodeInput } from '../helpers.js'; */
/** @import { QueryInput } from '../helpers.js'; */

import { camelCase, isDocument, isElement, isWindow } from '@fr0st/core';
import { css } from './../attributes/styles.js';
import { parseFilter, parseFilterContains, parseNodes } from './../filters.js';
import { parseClasses } from './../helpers.js';
import { closest } from './../traversal/traversal.js';
import { animations, data } from './../vars.js';

/**
 * Checks whether any of the nodes has an animation.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @returns {boolean} Whether any of the nodes has an animation.
 */
export function hasAnimation(selector) {
    return parseNodes(selector)
        .some((node) => animations.has(node));
};

/**
 * Checks whether any of the nodes has a specified attribute.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {string} attribute The attribute name.
 * @returns {boolean} Whether any of the nodes has the attribute.
 */
export function hasAttribute(selector, attribute) {
    return parseNodes(selector)
        .some((node) => node.hasAttribute(attribute));
};

/**
 * Checks whether any of the nodes has child nodes.
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @returns {boolean} Whether any of the nodes has child nodes.
 */
export function hasChildren(selector) {
    return parseNodes(selector, {
        fragment: true,
        shadow: true,
        document: true,
    }).some((node) => node.childElementCount);
};

/**
 * Checks whether any of the nodes has any of the specified classes.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {...string|string[]} classes The classes.
 * @returns {boolean} Whether any of the nodes has any of the classes.
 */
export function hasClass(selector, ...classes) {
    classes = parseClasses(classes);

    return parseNodes(selector)
        .some((node) =>
            classes.some((className) => node.classList.contains(className)),
        );
};

/**
 * Checks whether any of the nodes has a CSS animation.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @returns {boolean} Whether any of the nodes has a CSS animation.
 */
export function hasCSSAnimation(selector) {
    return parseNodes(selector)
        .some((node) =>
            parseFloat(css(node, 'animation-duration')),
        );
};

/**
 * Checks whether any of the nodes has a CSS transition.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @returns {boolean} Whether any of the nodes has a CSS transition.
 */
export function hasCSSTransition(selector) {
    return parseNodes(selector)
        .some((node) =>
            parseFloat(css(node, 'transition-duration')),
        );
};

/**
 * Checks whether any of the nodes has custom data.
 * @param {QueryInput} selector The input node(s), or a query selector string.
 * @param {string} [key] The data key.
 * @returns {boolean} Whether any of the nodes has custom data.
 */
export function hasData(selector, key) {
    return parseNodes(selector, {
        fragment: true,
        shadow: true,
        document: true,
        window: true,
    }).some((node) => {
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
 * Checks whether any of the nodes has the specified dataset value.
 * @param {QueryInput} selector The input node(s), or a query selector string.
 * @param {string} [key] The dataset key.
 * @returns {boolean} Whether any of the nodes has the dataset value.
 */
export function hasDataset(selector, key) {
    key = camelCase(key);

    return parseNodes(selector)
        .some((node) => !!node.dataset[key]);
};

/**
 * Checks whether any of the nodes contains a descendant matching a filter.
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
 * @returns {boolean} Whether any of the nodes contains a descendant matching the filter.
 */
export function hasDescendent(selector, nodeFilter) {
    nodeFilter = parseFilterContains(nodeFilter);

    return parseNodes(selector, {
        fragment: true,
        shadow: true,
        document: true,
    }).some(nodeFilter);
};

/**
 * Checks whether any of the nodes has a DocumentFragment.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @returns {boolean} Whether any of the nodes has a DocumentFragment.
 */
export function hasFragment(selector) {
    return parseNodes(selector)
        .some((node) => node.content);
};

/**
 * Checks whether any of the nodes has a specified property.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {string} property The property name.
 * @returns {boolean} Whether any of the nodes has the property.
 */
export function hasProperty(selector, property) {
    return parseNodes(selector)
        .some((node) => Object.hasOwn(node, property));
};

/**
 * Checks whether any of the nodes has a ShadowRoot.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @returns {boolean} Whether any of the nodes has a ShadowRoot.
 */
export function hasShadow(selector) {
    return parseNodes(selector)
        .some((node) => node.shadowRoot);
};

/**
 * Checks whether any of the nodes matches a filter.
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
 * @returns {boolean} Whether any of the nodes matches the filter.
 */
export function is(selector, nodeFilter) {
    nodeFilter = parseFilter(nodeFilter);

    return parseNodes(selector, {
        node: true,
        fragment: true,
        shadow: true,
    }).some(nodeFilter);
};

/**
 * Checks whether any of the nodes is connected to the DOM.
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @returns {boolean} Whether any of the nodes is connected to the DOM.
 */
export function isConnected(selector) {
    return parseNodes(selector, {
        node: true,
        fragment: true,
        shadow: true,
    }).some((node) => node.isConnected);
};

/**
 * Checks whether any of the nodes is considered equal to any of the other nodes.
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @param {NodeInput} otherSelector The other node(s), or a query selector string.
 * @param {{shallow?: boolean}} [options] The comparison options.
 * @returns {boolean} Whether any of the nodes is considered equal to any of the other nodes.
 */
export function isEqual(selector, otherSelector, { shallow = false } = {}) {
    let nodes = parseNodes(selector, {
        node: true,
        fragment: true,
        shadow: true,
    });

    let others = parseNodes(otherSelector, {
        node: true,
        fragment: true,
        shadow: true,
    });

    if (shallow) {
        nodes = $.clone(nodes, { deep: false });
        others = $.clone(others, { deep: false });
    }

    return nodes.some((node) =>
        others.some((other) => node.isEqualNode(other)),
    );
};

/**
 * Checks whether any of the nodes or a parent of any of the nodes is "fixed".
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @returns {boolean} Whether any of the nodes is "fixed".
 */
export function isFixed(selector) {
    return parseNodes(selector, {
        node: true,
    }).some((node) =>
        (isElement(node) && css(node, 'position') === 'fixed') ||
        closest(
            node,
            (parent) => isElement(parent) && css(parent, 'position') === 'fixed',
        ).length,
    );
};

/**
 * Checks whether any of the nodes is hidden.
 * @param {QueryInput} selector The input node(s), or a query selector string.
 * @returns {boolean} Whether any of the nodes is hidden.
 */
export function isHidden(selector) {
    return parseNodes(selector, {
        node: true,
        document: true,
        window: true,
    }).some((node) => {
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
 * Checks whether any of the nodes is considered identical to any of the other nodes.
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @param {NodeInput} otherSelector The other node(s), or a query selector string.
 * @returns {boolean} Whether any of the nodes is considered identical to any of the other nodes.
 */
export function isSame(selector, otherSelector) {
    const others = parseNodes(otherSelector, {
        node: true,
        fragment: true,
        shadow: true,
    });

    return parseNodes(selector, {
        node: true,
        fragment: true,
        shadow: true,
    }).some((node) =>
        others.some((other) => node.isSameNode(other)),
    );
};

/**
 * Checks whether any of the nodes is visible.
 * @param {QueryInput} selector The input node(s), or a query selector string.
 * @returns {boolean} Whether any of the nodes is visible.
 */
export function isVisible(selector) {
    return parseNodes(selector, {
        node: true,
        document: true,
        window: true,
    }).some((node) => {
        if (isWindow(node)) {
            return node.document.visibilityState === 'visible';
        }

        if (isDocument(node)) {
            return node.visibilityState === 'visible';
        }

        return node.offsetParent;
    });
};
