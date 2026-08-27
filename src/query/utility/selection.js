/** @import QuerySet from '../query-set.js'; */

import { afterSelection as _afterSelection, beforeSelection as _beforeSelection, select as _select, selectAll as _selectAll, wrapSelection as _wrapSelection } from './../../utility/selection.js';

/**
 * Inserts each node after the selection.
 * @returns {QuerySet} The QuerySet object.
 */
export function afterSelection() {
    _afterSelection(this);

    return this;
};

/**
 * Inserts each node before the selection.
 * @returns {QuerySet} The QuerySet object.
 */
export function beforeSelection() {
    _beforeSelection(this);

    return this;
};

/**
 * Creates a selection on the first node.
 * @returns {QuerySet} The QuerySet object.
 */
export function select() {
    _select(this);

    return this;
};

/**
 * Creates a selection containing all of the nodes.
 * @returns {QuerySet} The QuerySet object.
 */
export function selectAll() {
    _selectAll(this);

    return this;
};

/**
 * Wraps selected nodes with other nodes.
 * @returns {QuerySet} The QuerySet object.
 */
export function wrapSelection() {
    _wrapSelection(this);

    return this;
};
