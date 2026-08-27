/** @import { ElementInput } from '../helpers.js'; */
/** @import { EventCallback } from './event-handlers.js'; */

import { getContext, getWindow } from './../config.js';
import { parseNode } from './../filters.js';

/**
 * Triggers a blur event on the first node.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 */
export function blur(selector) {
    const node = parseNode(selector);

    if (!node) {
        return;
    }

    node.blur();
};

/**
 * Triggers a click event on the first node.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 */
export function click(selector) {
    const node = parseNode(selector);

    if (!node) {
        return;
    }

    node.click();
};

/**
 * Triggers a focus event on the first node.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 */
export function focus(selector) {
    const node = parseNode(selector);

    if (!node) {
        return;
    }

    node.focus();
};

/**
 * Adds a function to the ready queue.
 * @param {EventCallback} callback The callback to execute.
 */
export function ready(callback) {
    if (getContext().readyState !== 'loading') {
        callback();
    } else {
        getWindow().addEventListener('DOMContentLoaded', callback, { once: true });
    }
};
