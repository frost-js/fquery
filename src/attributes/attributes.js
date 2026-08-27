/** @import { ElementInput } from '../helpers.js'; */

import { camelCase, merge } from '@fr0st/core';
import { parseNode, parseNodes } from './../filters.js';
import { parseData, parseDataset } from './../helpers.js';
import { removeNode } from './../manipulation/manipulation.js';

/**
 * @typedef {Record<string, *>} AttributeValues
 */

/**
 * Gets attribute value(s) for the first node.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {string} [attribute] The attribute name.
 * @returns {string|null|Record<string, string|null>|undefined} The attribute value, all attributes, or `undefined` if no element matches.
 */
export function getAttribute(selector, attribute) {
    const node = parseNode(selector);

    if (!node) {
        return;
    }

    if (attribute) {
        return node.getAttribute(attribute);
    }

    return Object.fromEntries(
        merge([], node.attributes)
            .map((attribute) => [attribute.nodeName, attribute.nodeValue]),
    );
};

/**
 * Gets dataset value(s) for the first node.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {string} [key] The dataset key.
 * @returns {*|undefined} The dataset value, all dataset values, or `undefined` if no element matches.
 */
export function getDataset(selector, key) {
    const node = parseNode(selector);

    if (!node) {
        return;
    }

    if (key) {
        key = camelCase(key);

        return parseDataset(node.dataset[key]);
    }

    return Object.fromEntries(
        Object.entries(node.dataset)
            .map(([key, value]) => [key, parseDataset(value)]),
    );
};

/**
 * Gets the HTML contents of the first node.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @returns {string|undefined} The HTML contents, or `undefined` if no element matches.
 */
export function getHTML(selector) {
    return getProperty(selector, 'innerHTML');
};

/**
 * Gets a property value for the first node.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {string} property The property name.
 * @returns {*|undefined} The property value, or `undefined` if no element matches.
 */
export function getProperty(selector, property) {
    const node = parseNode(selector);

    if (!node) {
        return;
    }

    return node[property];
};

/**
 * Gets the text contents of the first node.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @returns {string|null|undefined} The text contents, or `undefined` if no element matches.
 */
export function getText(selector) {
    return getProperty(selector, 'textContent');
};

/**
 * Gets the value property of the first node.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @returns {*|undefined} The value, or `undefined` if no element matches.
 */
export function getValue(selector) {
    return getProperty(selector, 'value');
};

/**
 * Removes an attribute from each node.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {string} attribute The attribute name.
 */
export function removeAttribute(selector, attribute) {
    const nodes = parseNodes(selector);

    for (const node of nodes) {
        node.removeAttribute(attribute);
    }
};

/**
 * Removes a dataset value from each node.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {string} key The dataset key.
 */
export function removeDataset(selector, key) {
    const nodes = parseNodes(selector);

    for (const node of nodes) {
        key = camelCase(key);

        delete node.dataset[key];
    }
};

/**
 * Removes a property from each node.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {string} property The property name.
 */
export function removeProperty(selector, property) {
    const nodes = parseNodes(selector);

    for (const node of nodes) {
        delete node[property];
    }
};

/**
 * Sets an attribute value for each node.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {string|AttributeValues} attribute The attribute name, or an object containing attributes.
 * @param {*} [value] The attribute value.
 */
export function setAttribute(selector, attribute, value) {
    const nodes = parseNodes(selector);

    const attributes = parseData(attribute, value);

    for (const [key, value] of Object.entries(attributes)) {
        for (const node of nodes) {
            node.setAttribute(key, value);
        }
    }
};

/**
 * Sets a dataset value for each node.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {string|Record<string, *>} key The dataset key, or an object containing dataset values.
 * @param {*} [value] The dataset value.
 */
export function setDataset(selector, key, value) {
    const nodes = parseNodes(selector);

    const dataset = parseData(key, value, { json: true });

    for (let [key, value] of Object.entries(dataset)) {
        key = camelCase(key);
        for (const node of nodes) {
            node.dataset[key] = value;
        }
    }
};

/**
 * Sets the HTML contents of each node.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {string} html The HTML contents.
 */
export function setHTML(selector, html) {
    const nodes = parseNodes(selector);

    for (const node of nodes) {
        const childNodes = merge([], node.children);

        for (const child of childNodes) {
            removeNode(child);
        }

        // Remove ShadowRoot
        if (node.shadowRoot) {
            removeNode(node.shadowRoot);
        }

        // Remove DocumentFragment
        if (node.content) {
            removeNode(node.content);
        }

        node.innerHTML = html;
    }
};

/**
 * Sets a property value for each node.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {string|Record<string, *>} property The property name, or an object containing properties.
 * @param {*} [value] The property value.
 */
export function setProperty(selector, property, value) {
    const nodes = parseNodes(selector);

    const properties = parseData(property, value);

    for (const [key, value] of Object.entries(properties)) {
        for (const node of nodes) {
            node[key] = value;
        }
    }
};

/**
 * Sets the text contents of each node.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {string} text The text contents.
 */
export function setText(selector, text) {
    const nodes = parseNodes(selector);

    for (const node of nodes) {
        const childNodes = merge([], node.children);

        for (const child of childNodes) {
            removeNode(child);
        }

        // Remove ShadowRoot
        if (node.shadowRoot) {
            removeNode(node.shadowRoot);
        }

        // Remove DocumentFragment
        if (node.content) {
            removeNode(node.content);
        }

        node.textContent = text;
    }
};

/**
 * Sets the value property of each node.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {string} value The value.
 */
export function setValue(selector, value) {
    const nodes = parseNodes(selector);

    for (const node of nodes) {
        node.value = value;
    }
};
