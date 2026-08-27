/** @import QuerySet from '../query-set.js'; */

import { blur as _blur, click as _click, focus as _focus } from './../../events/events.js';

/**
 * Triggers a blur event on the first node.
 * @returns {QuerySet} The QuerySet object.
 */
export function blur() {
    _blur(this);

    return this;
};

/**
 * Triggers a click event on the first node.
 * @returns {QuerySet} The QuerySet object.
 */
export function click() {
    _click(this);

    return this;
};

/**
 * Triggers a focus event on the first node.
 * @returns {QuerySet} The QuerySet object.
 */
export function focus() {
    _focus(this);

    return this;
};
