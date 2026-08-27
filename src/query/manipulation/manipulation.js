/** @import { CloneOptions } from '../../manipulation/manipulation.js'; */
/** @import { NodeInput } from '../../helpers.js'; */

import { clone as _clone, detach as _detach, empty as _empty, remove as _remove, replaceAll as _replaceAll, replaceWith as _replaceWith } from './../../manipulation/manipulation.js';
import QuerySet from './../query-set-core.js';

/**
 * Clones each node.
 * @param {CloneOptions} [options] The cloning options.
 * @returns {QuerySet} A new QuerySet object.
 */
export function clone(options) {
    const clones = _clone(this, options);

    return new QuerySet(clones);
};

/**
 * Detaches each node from the DOM.
 * @returns {QuerySet} The QuerySet object.
 */
export function detach() {
    _detach(this);

    return this;
};

/**
 * Removes all children of each node from the DOM.
 * @returns {QuerySet} The QuerySet object.
 */
export function empty() {
    _empty(this);

    return this;
};

/**
 * Removes each node from the DOM.
 * @returns {QuerySet} The QuerySet object.
 */
export function remove() {
    _remove(this);

    return this;
};

/**
 * Replaces each other node with nodes.
 * @param {NodeInput} otherSelector The input node(s), or a query selector string.
 * @returns {QuerySet} The QuerySet object.
 */
export function replaceAll(otherSelector) {
    _replaceAll(this, otherSelector);

    return this;
};

/**
 * Replaces each node with other nodes.
 * @param {NodeInput} otherSelector The input node(s), or a query selector or HTML string.
 * @returns {QuerySet} The QuerySet object.
 */
export function replaceWith(otherSelector) {
    _replaceWith(this, otherSelector);

    return this;
};
