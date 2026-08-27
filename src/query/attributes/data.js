/** @import { QueryInput } from '../../helpers.js'; */
/** @import QuerySet from '../query-set.js'; */

import { cloneData as _cloneData, getData as _getData, removeData as _removeData, setData as _setData } from './../../attributes/data.js';

/**
 * Clones custom data from each node to each other node.
 * @param {QueryInput} otherSelector The other node(s), or a query selector string.
 * @returns {QuerySet} The QuerySet object.
 */
export function cloneData(otherSelector) {
    _cloneData(this, otherSelector);

    return this;
};

/**
 * Gets custom data for the first node.
 * @param {string} [key] The data key.
 * @returns {*|undefined} The data value, all custom data, or `undefined` if none exists.
 */
export function getData(key) {
    return _getData(this, key);
};

/**
 * Removes custom data from each node.
 * @param {string} [key] The data key.
 * @returns {QuerySet} The QuerySet object.
 */
export function removeData(key) {
    _removeData(this, key);

    return this;
};

/**
 * Sets custom data for each node.
 * @param {string|Record<string, *>} key The data key, or an object containing data.
 * @param {*} [value] The data value.
 * @returns {QuerySet} The QuerySet object.
 */
export function setData(key, value) {
    _setData(this, key, value);

    return this;
};
