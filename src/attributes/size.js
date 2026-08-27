/** @import { QueryInput } from '../helpers.js'; */

import { isDocument, isWindow } from '@fr0st/core';
import { parseNode } from './../filters.js';
import { BORDER_BOX, CONTENT_BOX, MARGIN_BOX, PADDING_BOX, SCROLL_BOX } from './../vars.js';
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
        node = node.documentElement;
    }

    if (boxSize >= SCROLL_BOX) {
        return node.scrollHeight;
    }

    let result = node.clientHeight;

    if (boxSize <= CONTENT_BOX) {
        result -= parseInt(css(node, 'padding-top'));
        result -= parseInt(css(node, 'padding-bottom'));
    }

    if (boxSize >= BORDER_BOX) {
        result += parseInt(css(node, 'border-top-width'));
        result += parseInt(css(node, 'border-bottom-width'));
    }

    if (boxSize >= MARGIN_BOX) {
        result += parseInt(css(node, 'margin-top'));
        result += parseInt(css(node, 'margin-bottom'));
    }

    return result;
};

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
        node = node.documentElement;
    }

    if (boxSize >= SCROLL_BOX) {
        return node.scrollWidth;
    }

    let result = node.clientWidth;

    if (boxSize <= CONTENT_BOX) {
        result -= parseInt(css(node, 'padding-left'));
        result -= parseInt(css(node, 'padding-right'));
    }

    if (boxSize >= BORDER_BOX) {
        result += parseInt(css(node, 'border-left-width'));
        result += parseInt(css(node, 'border-right-width'));
    }

    if (boxSize >= MARGIN_BOX) {
        result += parseInt(css(node, 'margin-left'));
        result += parseInt(css(node, 'margin-right'));
    }

    return result;
};
