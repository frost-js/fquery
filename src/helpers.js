import { escapeRegExp, isArray, isNumeric, isObject, isString, isUndefined, kebabCase, merge } from '@fr0st/core';
import { getWindow } from './config.js';
import QuerySet from './query/query-set-core.js';

/**
 * @typedef {string|Element|Array<string|Element>|NodeList|HTMLCollection|QuerySet} ElementInput
 */

/**
 * @typedef {string|Node|Array<string|Node>|NodeList|HTMLCollection|QuerySet} NodeInput
 */

/**
 * @typedef {string|Node|Window|Array<string|Node|Window>|NodeList|HTMLCollection|QuerySet} QueryInput
 */

/**
 * @callback NodeFilterCallback
 * @param {Node|Window} node The node to test.
 * @returns {boolean} Whether the node matches.
 */

/**
 * Creates a custom event.
 * @param {string} type The event type.
 * @param {CustomEventInit} [options] The event options.
 * @returns {CustomEvent} The custom event.
 */
export function createEvent(type, options) {
    const { CustomEvent } = getWindow();

    return new CustomEvent(type, options);
};

/**
 * Creates a wrapped version of a function that executes once per tick.
 * @template {(...args: any[]) => any} T
 * @param {T} callback The callback to debounce.
 * @returns {(...args: Parameters<T>) => void} The wrapped function.
 */
export function debounce(callback) {
    let running;

    return (...args) => {
        if (running) {
            return;
        }

        running = true;

        Promise.resolve().then((_) => {
            try {
                callback(...args);
            } finally {
                running = false;
            }
        });
    };
};

/**
 * Escapes a string for use as a CSS identifier.
 * @param {string} value The value to escape.
 * @returns {string} The escaped value.
 */
export function escapeCSS(value) {
    return getWindow().CSS.escape(value);
};

/**
 * Returns a RegExp for testing a namespaced event.
 * @param {string} event The namespaced event.
 * @returns {RegExp} The namespaced event RegExp.
 */
export function eventNamespacedRegExp(event) {
    return new RegExp(`^${escapeRegExp(event)}(?:\\.|$)`, 'i');
};

/**
 * Normalizes a CSS property name.
 * @param {string} style The CSS property name.
 * @returns {string} The normalized CSS property name.
 */
export function normalizeCssProperty(style) {
    return style.startsWith('--') ?
        `--${kebabCase(style.slice(2))}` :
        kebabCase(style);
};

/**
 * Normalizes a CSS property value.
 * @param {string} style The CSS property name.
 * @param {string|number} value The CSS property value.
 * @returns {string|number} The normalized CSS property value.
 */
export function normalizeCssValue(style, value) {
    if (style.startsWith('--') || !value || !isNumeric(value)) {
        return value;
    }

    const { CSS } = getWindow();

    return !CSS.supports(style, value) ?
        `${value}px` :
        value;
};

/**
 * Returns a one-dimensional array of classes from nested arrays or space-separated strings.
 * @param {Array<string|string[]>} classList The classes to parse.
 * @returns {string[]} The parsed classes.
 */
export function parseClasses(classList) {
    return classList
        .flat()
        .flatMap((val) => val.split(' '))
        .filter((val) => !!val);
};

/**
 * Normalizes a key and value, or an existing data object, into a data object.
 * @param {string|Record<string, *>} key The data key, or an object containing data.
 * @param {*} [value] The data value.
 * @param {{json?: boolean}} [options] The options for parsing data.
 * @returns {Record<string, *>} The data object.
 */
export function parseData(key, value, { json = false } = {}) {
    const result = isString(key) ?
        { [key]: value } :
        key;

    if (!json) {
        return result;
    }

    return Object.fromEntries(
        Object.entries(result)
            .map(([key, value]) => [key, isObject(value) || isArray(value) ? JSON.stringify(value) : value]),
    );
};

/**
 * Parses a dataset string into a JavaScript value.
 * @param {string} value The input value.
 * @returns {boolean|number|Record<string, *>|Array<*>|string|null|undefined} The parsed value.
 */
export function parseDataset(value) {
    if (isUndefined(value)) {
        return value;
    }

    const lower = value.toLowerCase().trim();

    if (['true', 'on'].includes(lower)) {
        return true;
    }

    if (['false', 'off'].includes(lower)) {
        return false;
    }

    if (lower === 'null') {
        return null;
    }

    if (isNumeric(lower)) {
        return parseFloat(lower);
    }

    if (['{', '['].includes(lower.charAt(0))) {
        try {
            const result = JSON.parse(value);
            return result;
        } catch {
            // Ignore malformed JSON-like strings.
        }
    }

    return value;
};

/**
 * Returns the base event name from a namespaced event.
 * @param {string} event The namespaced event.
 * @returns {string} The real event.
 */
export function parseEvent(event) {
    return event.split('.')
        .shift();
};

/**
 * Returns an array of events from a space-separated string.
 * @param {string} events The events.
 * @returns {string[]} The parsed events.
 */
export function parseEvents(events) {
    return events.split(' ');
};

/**
 * Resolves a single node.
 * @param {QueryInput} nodes The input node(s), or a query selector or HTML string.
 * @param {((value: string) => (Node|Window|null|undefined))} stringCallback The callback used to resolve strings.
 * @param {NodeFilterCallback} nodeFilter The callback used to filter nodes.
 * @returns {Node|Window|null|undefined} The resolved node, or `undefined` if none matches.
 */
export function resolveNode(nodes, stringCallback, nodeFilter) {
    if (isString(nodes)) {
        return stringCallback(nodes);
    }

    if (nodeFilter(nodes)) {
        return nodes;
    }

    if (nodes instanceof QuerySet) {
        const node = nodes.get(0);

        return nodeFilter(node) ? node : undefined;
    }

    if (nodes && typeof nodes.item === 'function') {
        const node = nodes.item(0);

        return nodeFilter(node) ? node : undefined;
    }
};

/**
 * Resolves multiple nodes.
 * @param {QueryInput} nodes The input node(s), or a query selector or HTML string.
 * @param {((value: string) => Array<Node|Window>)} stringCallback The callback used to resolve strings.
 * @param {NodeFilterCallback} nodeFilter The callback used to filter nodes.
 * @returns {Array<Node|Window>} The resolved nodes.
 */
export function resolveNodes(nodes, stringCallback, nodeFilter) {
    if (isString(nodes)) {
        return stringCallback(nodes);
    }

    if (nodeFilter(nodes)) {
        return [nodes];
    }

    if (nodes instanceof QuerySet) {
        return nodes.get().filter(nodeFilter);
    }

    if (nodes && typeof nodes.item === 'function') {
        return merge([], nodes).filter(nodeFilter);
    }

    return [];
};
