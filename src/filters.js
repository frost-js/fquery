/** @import { NodeFilterCallback } from './helpers.js'; */
/** @import { NodeInput } from './helpers.js'; */
/** @import { QueryContextInput } from './traversal/find.js'; */
/** @import { QueryInput } from './helpers.js'; */

import { callDOMMethod, getDOMProperty, isArray, isDocument, isElement, isFragment, isFunction, isNode, isShadow, isString, isWindow, merge, unique } from '@fr0st/core';
import { getContext } from './config.js';
import { resolveNode, resolveNodes } from './helpers.js';
import { parseHTML } from './parser/parser.js';
import { find, findOne } from './traversal/find.js';

/**
 * @typedef {NodeInput|NodeFilterCallback} NodeFilterInput
 */

/**
 * @typedef {object} NodeParseOptions
 * @property {boolean} [node=false] Whether to allow text and comment nodes.
 * @property {boolean} [fragment=false] Whether to allow DocumentFragment.
 * @property {boolean} [shadow=false] Whether to allow ShadowRoot.
 * @property {boolean} [document=false] Whether to allow Document.
 * @property {boolean} [window=false] Whether to allow Window.
 * @property {boolean} [html=false] Whether to allow HTML strings.
 * @property {QueryContextInput} [context] The query context.
 */

/**
 * Returns a node filter callback.
 * @param {NodeFilterInput} filter The filter node(s), a query selector string or custom filter function.
 * @param {boolean} [defaultValue=true] The default return value.
 * @returns {NodeFilterCallback} The node filter callback.
 */
export function parseFilter(filter, defaultValue = true) {
    if (!filter) {
        return (_) => defaultValue;
    }

    if (isFunction(filter)) {
        return filter;
    }

    if (isString(filter)) {
        return (node) => isElement(node) && callDOMMethod(node, 'matches', filter);
    }

    if (isNode(filter) || isFragment(filter) || isShadow(filter)) {
        return (node) => callDOMMethod(node, 'isSameNode', filter);
    }

    filter = parseNodes(filter, {
        node: true,
        fragment: true,
        shadow: true,
    });

    if (filter.length) {
        return (node) => filter.includes(node);
    }

    return (_) => !defaultValue;
};

/**
 * Returns a node-containment filter callback.
 * @param {NodeFilterInput} filter The filter node(s), a query selector string or custom filter function.
 * @param {boolean} [defaultValue=true] The default return value.
 * @returns {NodeFilterCallback} The node contains filter callback.
 */
export function parseFilterContains(filter, defaultValue = true) {
    if (!filter) {
        return (node) => defaultValue && !!getDOMProperty(node, 'firstElementChild');
    }

    if (isFunction(filter)) {
        return (node) => merge([], callDOMMethod(node, 'querySelectorAll', '*')).some(filter);
    }

    if (isString(filter)) {
        return (node) => !!findOne(filter, node);
    }

    if (isNode(filter) || isFragment(filter) || isShadow(filter)) {
        return (node) => node !== filter && callDOMMethod(node, 'contains', filter);
    }

    filter = parseNodes(filter, {
        node: true,
        fragment: true,
        shadow: true,
    });

    if (filter.length) {
        return (node) => filter.some((other) => node !== other && callDOMMethod(node, 'contains', other));
    }

    return (_) => !defaultValue;
};

/**
 * Returns the first node matching a filter.
 * @param {QueryInput} nodes The input node(s), or a query selector or HTML string.
 * @param {NodeParseOptions} [options] The parsing options.
 * @returns {Node|Window|null|undefined} The matching node, or `undefined` if none matches.
 */
export function parseNode(nodes, options = {}) {
    const filter = parseNodesFilter(options);
    const context = options.context || getContext();
    const stringCallback = (node) => options.html && node.trim().charAt(0) === '<' ?
        parseHTML(node).shift() :
        findOne(node, context);

    if (!isArray(nodes)) {
        return resolveNode(nodes, stringCallback, filter);
    }

    for (const node of nodes) {
        const result = resolveNode(node, stringCallback, filter);

        if (result) {
            return result;
        }
    }
};

/**
 * Returns a filtered array of nodes.
 * @param {QueryInput} nodes The input node(s), or a query selector or HTML string.
 * @param {NodeParseOptions} [options] The parsing options.
 * @returns {Array<Node|Window>} The filtered array of nodes.
 */
export function parseNodes(nodes, options = {}) {
    const filter = parseNodesFilter(options);
    const context = options.context || getContext();
    const stringCallback = (node) => options.html && node.trim().charAt(0) === '<' ?
        parseHTML(node) :
        find(node, context);

    if (!isArray(nodes)) {
        return resolveNodes(nodes, stringCallback, filter);
    }

    const results = nodes.flatMap((node) => resolveNodes(node, stringCallback, filter));

    return nodes.length > 1 && results.length > 1 ?
        unique(results) :
        results;
};

/**
 * Returns a function for filtering nodes.
 * @param {NodeParseOptions} [options] The parsing options.
 * @returns {NodeFilterCallback} The node filter function.
 */
function parseNodesFilter({
    node = false,
    document = false,
    window = false,
    fragment = false,
    shadow = false,
} = {}) {
    return (value) =>
        (node ? isNode(value) : isElement(value)) ||
        (document && isDocument(value)) ||
        (window && isWindow(value)) ||
        (fragment && isFragment(value)) ||
        (shadow && isShadow(value));
};
