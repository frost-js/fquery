
import { callDOMMethod, merge } from '@fr0st/core';
import { getContext, getWindow } from './../config.js';

/**
 * Creates a Document object from a string.
 * @param {string} input The input string.
 * @param {{contentType?: DOMParserSupportedType}} [options] The parsing options.
 * @returns {Document} A new Document object.
 */
export function parseDocument(input, { contentType = 'text/html' } = {}) {
    const { DOMParser } = getWindow();
    const parser = new DOMParser;

    return parser.parseFromString(input, contentType);
};

/**
 * Creates an array containing elements parsed from an HTML string.
 * @param {string} html The HTML input string.
 * @returns {Element[]} The parsed elements.
 */
export function parseHtml(html) {
    const childNodes = callDOMMethod(getContext(), 'createRange')
        .createContextualFragment(html)
        .children;

    return merge([], childNodes);
};
