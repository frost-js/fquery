/** @import { QueryContextInput } from '../traversal/find.js'; */
/** @import { QueryInput } from '../helpers.js'; */

import { isFunction } from '@fr0st/core';
import { getContext } from './../config.js';
import { ready } from './../events/events.js';
import { parseNode, parseNodes } from './../filters.js';
import QuerySet from './query-set.js';

/**
 * Adds a function to the ready queue or returns a QuerySet.
 * @param {(() => void)|QueryInput} selector The ready callback or input selector.
 * @param {QueryContextInput} [context] The context to search in.
 * @returns {QuerySet|undefined} A new QuerySet, or `undefined` when registering a ready callback.
 */
export function query(selector, context = null) {
    if (isFunction(selector)) {
        return ready(selector);
    }

    const nodes = parseNodes(selector, {
        node: true,
        fragment: true,
        shadow: true,
        document: true,
        window: true,
        html: true,
        context: context || getContext(),
    });

    return new QuerySet(nodes);
};

/**
 * Returns a QuerySet for the first node.
 * @param {QueryInput} selector The input selector.
 * @param {QueryContextInput} [context] The context to search in.
 * @returns {QuerySet} The new QuerySet object.
 */
export function queryOne(selector, context = null) {
    const node = parseNode(selector, {
        node: true,
        fragment: true,
        shadow: true,
        document: true,
        window: true,
        html: true,
        context: context || getContext(),
    });

    return new QuerySet(node ? [node] : []);
};
