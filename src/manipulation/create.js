/** @import { ElementInput } from '../helpers.js'; */

import { camelCase, kebabCase, wrap } from '@fr0st/core';
import { getContext } from './../config.js';
import { parseNode } from './../filters.js';
import { normalizeCssValue, parseClasses, parseData } from './../helpers.js';

/**
 * @typedef {object} CreateOptions
 * @property {string} [html] The HTML contents.
 * @property {string} [text] The text contents.
 * @property {string|string[]} [class] The classes.
 * @property {Record<string, string|number>} [style] The style properties.
 * @property {*} [value] The value.
 * @property {Record<string, *>} [attributes] The attributes.
 * @property {Record<string, *>} [properties] The properties.
 * @property {Record<string, *>} [dataset] The dataset values.
 */

/**
 * Attaches a shadow DOM tree to the first node.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {{open?: boolean}} [options] The shadow DOM options.
 * @returns {ShadowRoot|undefined} The new ShadowRoot, or `undefined` if no element matches.
 */
export function attachShadow(selector, { open = true } = {}) {
    const node = parseNode(selector);

    if (!node) {
        return;
    }

    return node.attachShadow({
        mode: open ?
            'open' :
            'closed',
    });
};

/**
 * Creates a new DOM element.
 * @param {string} [tagName='div'] The type of HTML element to create.
 * @param {CreateOptions} [options] The element options.
 * @returns {HTMLElement} The new HTMLElement.
 */
export function create(tagName = 'div', options = {}) {
    const node = getContext().createElement(tagName);

    if ('html' in options) {
        node.innerHTML = options.html;
    } else if ('text' in options) {
        node.textContent = options.text;
    }

    if ('class' in options) {
        const classes = parseClasses(wrap(options.class));

        node.classList.add(...classes);
    }

    if ('style' in options) {
        for (let [style, value] of Object.entries(options.style)) {
            style = kebabCase(style);
            value = normalizeCssValue(style, value);

            node.style.setProperty(style, value);
        }
    }

    if ('value' in options) {
        node.value = options.value;
    }

    if ('attributes' in options) {
        for (const [key, value] of Object.entries(options.attributes)) {
            node.setAttribute(key, value);
        }
    }

    if ('properties' in options) {
        for (const [key, value] of Object.entries(options.properties)) {
            node[key] = value;
        }
    }

    if ('dataset' in options) {
        const dataset = parseData(options.dataset, null, { json: true });

        for (let [key, value] of Object.entries(dataset)) {
            key = camelCase(key);
            node.dataset[key] = value;
        }
    }

    return node;
};

/**
 * Creates a new comment node.
 * @param {string} comment The comment contents.
 * @returns {Node} The new comment node.
 */
export function createComment(comment) {
    return getContext().createComment(comment);
};

/**
 * Creates a new document fragment.
 * @returns {DocumentFragment} The new DocumentFragment.
 */
export function createFragment() {
    return getContext().createDocumentFragment();
};

/**
 * Creates a new range object.
 * @returns {Range} The new Range.
 */
export function createRange() {
    return getContext().createRange();
};

/**
 * Creates a new text node.
 * @param {string} text The text contents.
 * @returns {Node} The new text node.
 */
export function createText(text) {
    return getContext().createTextNode(text);
};
