/** @import { ElementInput } from '../helpers.js'; */

import { kebabCase } from '@fr0st/core';
import { getWindow } from './../config.js';
import { parseNode, parseNodes } from './../filters.js';
import { normalizeCssValue, parseClasses, parseData } from './../helpers.js';
import { styles } from './../vars.js';

/** @typedef {Record<string, string|number>} StyleValues */

/**
 * Adds classes to each node.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {...string|string[]} classes The classes.
 */
export function addClass(selector, ...classes) {
    const nodes = parseNodes(selector);

    classes = parseClasses(classes);

    if (!classes.length) {
        return;
    }

    for (const node of nodes) {
        node.classList.add(...classes);
    }
};

/**
 * Gets computed CSS style value(s) for the first node.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {string} [style] The CSS style name.
 * @returns {string|Record<string, string>|undefined} The CSS style value, all computed styles, or `undefined` if no element matches.
 */
export function css(selector, style) {
    const node = parseNode(selector);

    if (!node) {
        return;
    }

    if (!styles.has(node)) {
        styles.set(
            node,
            getWindow().getComputedStyle(node),
        );
    }

    const nodeStyles = styles.get(node);

    if (!style) {
        const result = {};

        for (const property of nodeStyles) {
            result[property] = nodeStyles.getPropertyValue(property);
        }

        return result;
    }

    style = kebabCase(style);

    return nodeStyles.getPropertyValue(style);
};

/**
 * Gets style properties for the first node.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {string} [style] The style name.
 * @returns {string|Record<string, string>|undefined} The style value, all inline styles, or `undefined` if no element matches.
 */
export function getStyle(selector, style) {
    const node = parseNode(selector);

    if (!node) {
        return;
    }

    if (style) {
        style = kebabCase(style);

        return node.style[style];
    }

    const styles = {};

    for (const style of node.style) {
        styles[style] = node.style[style];
    }

    return styles;
};

/**
 * Hides each node from display.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 */
export function hide(selector) {
    const nodes = parseNodes(selector);

    for (const node of nodes) {
        node.style.setProperty('display', 'none');
    }
};

/**
 * Removes classes from each node.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {...string|string[]} classes The classes.
 */
export function removeClass(selector, ...classes) {
    const nodes = parseNodes(selector);

    classes = parseClasses(classes);

    if (!classes.length) {
        return;
    }

    for (const node of nodes) {
        node.classList.remove(...classes);
    }
};

/**
 * Removes a style property from each node.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {string} style The style name.
 */
export function removeStyle(selector, style) {
    const nodes = parseNodes(selector);

    style = kebabCase(style);

    for (const node of nodes) {
        node.style.removeProperty(style);
    }
};

/**
 * Sets style properties for each node.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {string|StyleValues} style The style name, or an object containing styles.
 * @param {string|number} [value] The style value.
 * @param {{important?: boolean}} [options] The style options.
 */
export function setStyle(selector, style, value, { important = false } = {}) {
    const nodes = parseNodes(selector);

    const styles = parseData(style, value);

    for (let [style, value] of Object.entries(styles)) {
        style = kebabCase(style);
        value = normalizeCssValue(style, value);

        for (const node of nodes) {
            node.style.setProperty(
                style,
                value,
                important ?
                    'important' :
                    '',
            );
        }
    }
};

/**
 * Displays each hidden node.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 */
export function show(selector) {
    const nodes = parseNodes(selector);

    for (const node of nodes) {
        node.style.setProperty('display', '');
    }
};

/**
 * Toggles the visibility of each node.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 */
export function toggle(selector) {
    const nodes = parseNodes(selector);

    for (const node of nodes) {
        node.style.setProperty(
            'display',
            node.style.display === 'none' ?
                '' :
                'none',
        );
    }
};

/**
 * Toggles classes for each node.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {...string|string[]} classes The classes.
 */
export function toggleClass(selector, ...classes) {
    const nodes = parseNodes(selector);

    classes = parseClasses(classes);

    if (!classes.length) {
        return;
    }

    for (const node of nodes) {
        for (const className of classes) {
            node.classList.toggle(className);
        }
    }
};
