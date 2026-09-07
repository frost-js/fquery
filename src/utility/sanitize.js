import { isFragment, merge } from '@fr0st/core';
import { getContext, getWindow } from './../config.js';
import { allowedTags as _allowedTags, uriAttributes } from './../vars.js';

/** @typedef {Record<string, Array<string|RegExp>>} AllowedTags */

/**
 * Sanitizes a HTML string.
 * @param {string} html The input HTML string.
 * @param {AllowedTags} [allowedTags] The allowed tags and attributes.
 * @returns {string} The sanitized HTML string.
 */
export function sanitize(html, allowedTags = _allowedTags) {
    const template = getContext().createElement('template');
    template.innerHTML = html;
    const fragment = template.content;
    const childNodes = merge([], fragment.children);

    for (const child of childNodes) {
        sanitizeNode(child, allowedTags);
    }

    return template.innerHTML;
};

/**
 * Checks whether an attribute is allowed.
 * @param {Attr} attribute The input attribute.
 * @param {Array<string|RegExp>} allowedAttributes The allowed attributes.
 * @returns {boolean} Whether the attribute is allowed.
 */
function isAllowedAttribute(attribute, allowedAttributes) {
    const name = attribute.nodeName.toLowerCase();
    const isAllowed = allowedAttributes.some((test) =>
        typeof test === 'string' ?
            test === name :
            test instanceof RegExp && test.test(name),
    );

    if (!isAllowed || !uriAttributes.has(name)) {
        return isAllowed;
    }

    try {
        const { URL } = getWindow();
        return new URL(attribute.nodeValue, getContext().baseURI).protocol !== 'javascript:';
    } catch {
        return false;
    }
};

/**
 * Sanitizes a single node.
 * @param {Element} node The input node.
 * @param {AllowedTags} [allowedTags] The allowed tags and attributes.
 */
function sanitizeNode(node, allowedTags = _allowedTags) {
    // check node
    const name = node.tagName.toLowerCase();

    if (!Object.hasOwn(allowedTags, name)) {
        node.remove();
        return;
    }

    // check node attributes
    const allowedAttributes = [];

    if (Object.hasOwn(allowedTags, '*')) {
        allowedAttributes.push(...allowedTags['*']);
    }

    allowedAttributes.push(...allowedTags[name]);

    const attributes = merge([], node.attributes);

    for (const attribute of attributes) {
        if (!isAllowedAttribute(attribute, allowedAttributes)) {
            node.removeAttribute(attribute.nodeName);
        }
    }

    // check children
    const childNodes = merge(
        [],
        isFragment(node.content) ?
            node.content.children :
            node.children,
    );
    for (const child of childNodes) {
        sanitizeNode(child, allowedTags);
    }
};
