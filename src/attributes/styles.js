/** @import { ElementInput } from '../helpers.js'; */

import { getDOMProperty } from '@fr0st/core';
import { getWindow } from './../config.js';
import { parseNode, parseNodes } from './../filters.js';
import { normalizeCssProperty, normalizeCssValue, parseClasses, parseData } from './../helpers.js';
import { styles } from './../vars.js';
import { assertStyleUnlocked, setStyleLock } from './style-locks.js';

/** @typedef {Record<string, string|number>} StyleValues */

const displayLocks = new WeakMap();

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
        getDOMProperty(node, 'classList').add(...classes);
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

    style = normalizeCssProperty(style);

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
        style = normalizeCssProperty(style);

        return getDOMProperty(node, 'style').getPropertyValue(style);
    }

    const styles = {};
    const inlineStyles = getDOMProperty(node, 'style');

    for (const style of inlineStyles) {
        styles[style] = inlineStyles.getPropertyValue(style);
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
        if (!displayLocks.has(node)) {
            assertStyleUnlocked(node, 'display');
        }
    }

    for (const node of nodes) {
        if (!displayLocks.has(node)) {
            displayLocks.set(node, setStyleLock(node, 'display', 'none'));
        } else {
            getDOMProperty(node, 'style').setProperty('display', 'none');
        }
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
        getDOMProperty(node, 'classList').remove(...classes);
    }
};

/**
 * Removes a style property from each node.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {string} style The style name.
 */
export function removeStyle(selector, style) {
    const nodes = parseNodes(selector);

    style = normalizeCssProperty(style);

    for (const node of nodes) {
        getDOMProperty(node, 'style').removeProperty(style);
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
        style = normalizeCssProperty(style);
        value = normalizeCssValue(style, value);

        for (const node of nodes) {
            getDOMProperty(node, 'style').setProperty(
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
        const release = displayLocks.get(node);

        if (release) {
            displayLocks.delete(node);
            release();
        }

        const style = getDOMProperty(node, 'style');

        if (style.display === 'none') {
            style.setProperty('display', '');
        }

        if (css(node, 'display') === 'none') {
            style.setProperty('display', 'revert');
        }
    }
};

/**
 * Toggles the visibility of each node.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {boolean} [force] Whether to show or hide. Omit to toggle the current state.
 */
export function toggle(selector, force) {
    const nodes = parseNodes(selector);

    for (const node of nodes) {
        if (force ?? (getDOMProperty(node, 'style').display === 'none' || css(node, 'display') === 'none')) {
            show(node);
        } else {
            hide(node);
        }
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
            getDOMProperty(node, 'classList').toggle(className);
        }
    }
};
