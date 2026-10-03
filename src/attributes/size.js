/** @import { QueryInput } from '../helpers.js'; */

import { getDomProperty, isDocument, isWindow } from '@fr0st/core';
import { parseNode } from '../filters.js';
import { BORDER_BOX, CONTENT_BOX, MARGIN_BOX, PADDING_BOX, SCROLL_BOX } from '../vars.js';
import { css } from './styles.js';

/**
 * @typedef {object} SizeOptions
 * @property {number} [boxSize=PADDING_BOX] The box sizing to calculate.
 * @property {boolean} [outer=false] Whether to use the Window outer dimension.
 */

/**
 * Gets the computed height of the first node.
 * @param {QueryInput} selector The input node(s), or a query selector string.
 * @param {SizeOptions} [options] The sizing options.
 * @returns {number|undefined} The height, or `undefined` if no node matches.
 */
export function height(selector, { boxSize = PADDING_BOX, outer = false } = {}) {
    let node = parseNode(selector, {
        document: true,
        window: true,
    });

    if (!node) {
        return;
    }

    if (isWindow(node)) {
        return outer ?
            node.outerHeight :
            node.innerHeight;
    }

    if (isDocument(node)) {
        node = getDomProperty(node, 'documentElement');
    }

    if (boxSize >= SCROLL_BOX) {
        return getDomProperty(node, 'scrollHeight');
    }

    let result = getDomProperty(node, 'clientHeight');

    if (boxSize <= CONTENT_BOX) {
        result -= Number.parseInt(css(node, 'padding-top'));
        result -= Number.parseInt(css(node, 'padding-bottom'));
        result = Math.max(0, result);
    }

    if (boxSize >= BORDER_BOX) {
        result = getDomProperty(node, 'offsetHeight') ??
            result + Number.parseInt(css(node, 'border-top-width')) + Number.parseInt(css(node, 'border-bottom-width'));
    }

    if (boxSize >= MARGIN_BOX) {
        result += Number.parseInt(css(node, 'margin-top'));
        result += Number.parseInt(css(node, 'margin-bottom'));
    }

    return result;
}

/**
 * Gets the computed width of the first node.
 * @param {QueryInput} selector The input node(s), or a query selector string.
 * @param {SizeOptions} [options] The sizing options.
 * @returns {number|undefined} The width, or `undefined` if no node matches.
 */
export function width(selector, { boxSize = PADDING_BOX, outer = false } = {}) {
    let node = parseNode(selector, {
        document: true,
        window: true,
    });

    if (!node) {
        return;
    }

    if (isWindow(node)) {
        return outer ?
            node.outerWidth :
            node.innerWidth;
    }

    if (isDocument(node)) {
        node = getDomProperty(node, 'documentElement');
    }

    if (boxSize >= SCROLL_BOX) {
        return getDomProperty(node, 'scrollWidth');
    }

    let result = getDomProperty(node, 'clientWidth');

    if (boxSize <= CONTENT_BOX) {
        result -= Number.parseInt(css(node, 'padding-left'));
        result -= Number.parseInt(css(node, 'padding-right'));
        result = Math.max(0, result);
    }

    if (boxSize >= BORDER_BOX) {
        result = getDomProperty(node, 'offsetWidth') ??
            result + Number.parseInt(css(node, 'border-left-width')) + Number.parseInt(css(node, 'border-right-width'));
    }

    if (boxSize >= MARGIN_BOX) {
        result += Number.parseInt(css(node, 'margin-left'));
        result += Number.parseInt(css(node, 'margin-right'));
    }

    return result;
}
