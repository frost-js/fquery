/** @import { ElementInput } from '../helpers.js'; */
/** @import { NodeFilterInput } from '../filters.js'; */
/** @import { NodeInput } from '../helpers.js'; */
/** @import { QueryInput } from '../helpers.js'; */

import { isDocument, isElement, isFragment, isShadow, isWindow, merge } from '@fr0st/core';
import { parseParams } from './../ajax/helpers.js';
import { getContext, getWindow } from './../config.js';
import { parseFilter, parseNode, parseNodes } from './../filters.js';

/**
 * Executes a command in the document context.
 * @param {string} command The command to execute.
 * @param {string} [value] The value to give the command.
 * @returns {boolean} Whether the command was executed.
 */
export function exec(command, value = null) {
    return getContext().execCommand(command, false, value);
};

/**
 * Gets the index of the first node relative to its parent.
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @returns {number|undefined} The index, or `undefined` if no node or parent matches.
 */
export function index(selector) {
    const node = parseNode(selector, {
        node: true,
    });

    if (!node || !node.parentNode) {
        return;
    }

    return merge([], node.parentNode.children).indexOf(node);
};

/**
 * Gets the index of the first node matching a filter.
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
 * @returns {number} The index.
 */
export function indexOf(selector, nodeFilter) {
    nodeFilter = parseFilter(nodeFilter);

    return parseNodes(selector, {
        node: true,
        fragment: true,
        shadow: true,
    }).findIndex(nodeFilter);
};

/**
 * Normalizes nodes (remove empty text nodes, and join adjacent text nodes).
 * @param {NodeInput} selector The input node(s), or a query selector string.
 */
export function normalize(selector) {
    const nodes = parseNodes(selector, {
        node: true,
        fragment: true,
        shadow: true,
        document: true,
    });

    for (const node of nodes) {
        node.normalize();
    }
};

/**
 * Returns a serialized string containing names and values of all form nodes.
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @returns {string} The serialized string.
 */
export function serialize(selector) {
    return parseParams(
        serializeArray(selector),
    );
};

/**
 * Returns a serialized array containing names and values of all form nodes.
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @returns {Array<{name: string, value: string}>} The serialized entries.
 */
export function serializeArray(selector) {
    return parseNodes(selector, {
        fragment: true,
        shadow: true,
    }).reduce(
        (values, node) => {
            if (
                (isElement(node) && node.matches('form')) ||
                isFragment(node) ||
                isShadow(node)
            ) {
                return values.concat(
                    serializeArray(
                        node.querySelectorAll(
                            'input, select, textarea',
                        ),
                    ),
                );
            }

            if (
                isElement(node) &&
                node.matches('[disabled], input[type=submit], input[type=reset], input[type=file], input[type=radio]:not(:checked), input[type=checkbox]:not(:checked)')
            ) {
                return values;
            }

            const name = node.getAttribute('name');
            if (!name) {
                return values;
            }

            if (
                isElement(node) &&
                node.matches('select[multiple]')
            ) {
                for (const option of node.selectedOptions) {
                    values.push(
                        {
                            name,
                            value: option.value || '',
                        },
                    );
                }
            } else {
                values.push(
                    {
                        name,
                        value: node.value || '',
                    },
                );
            }

            return values;
        },
        [],
    );
}

/**
 * Sorts nodes by their position in the document.
 * @param {QueryInput} selector The input node(s), or a query selector string.
 * @returns {Array<Node|Window>} The sorted nodes.
 */
export function sort(selector) {
    const { Node } = getWindow();

    return parseNodes(selector, {
        node: true,
        fragment: true,
        shadow: true,
        document: true,
        window: true,
    }).sort((node, other) => {
        if (isWindow(node)) {
            return 1;
        }

        if (isWindow(other)) {
            return -1;
        }

        if (isDocument(node)) {
            return 1;
        }

        if (isDocument(other)) {
            return -1;
        }

        if (isFragment(other)) {
            return 1;
        }

        if (isFragment(node)) {
            return -1;
        }

        const isNodeShadow = isShadow(node);
        const isOtherShadow = isShadow(other);

        if (isNodeShadow) {
            node = node.host;
        }

        if (isOtherShadow) {
            other = other.host;
        }

        if (!node.isConnected || !other.isConnected) {
            if (node.isConnected !== other.isConnected) {
                if (isNodeShadow && !node.isConnected) {
                    return 1;
                }

                if (isOtherShadow && !other.isConnected) {
                    return -1;
                }

                return node.isConnected ?
                    1 :
                    -1;
            }

            return 0;
        }

        if (node.isSameNode(other)) {
            return 0;
        }

        const pos = node.compareDocumentPosition(other);

        if (pos & Node.DOCUMENT_POSITION_FOLLOWING || pos & Node.DOCUMENT_POSITION_CONTAINED_BY) {
            return -1;
        }

        if (pos & Node.DOCUMENT_POSITION_PRECEDING || pos & Node.DOCUMENT_POSITION_CONTAINS) {
            return 1;
        }

        return 0;
    });
};

/**
 * Returns the tag name (lowercase) of the first node.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @returns {string|undefined} The node's lowercase tag name, or `undefined` if no element matches.
 */
export function tagName(selector) {
    const node = parseNode(selector);

    if (!node) {
        return;
    }

    return node.tagName.toLowerCase();
};
