import { callDomMethod, getDomProperty, isString } from '@fr0st/core';
import { appendQueryString } from '../ajax/helpers.js';
import { getContext } from '../config.js';

/** @typedef {Record<string, *>} StyleAttributes */

/** @typedef {string|StyleAttributes} StyleSource */

/**
 * @typedef {object} StyleLoadOptions
 * @property {boolean} [cache=true] Whether to cache the request.
 * @property {Document} [context] The document context. Defaults to the configured context.
 */

/**
 * Imports a CSS stylesheet.
 * @param {string|null} url The URL of the stylesheet.
 * @param {StyleAttributes} [attributes] Additional attributes to set on the link element.
 * @param {StyleLoadOptions} [options] The loading options.
 * @returns {Promise<void>} A promise that resolves when the stylesheet loads, or rejects on failure.
 */
export function loadStyle(url, attributes, { cache = true, context = getContext() } = {}) {
    attributes = {
        href: url,
        rel: 'stylesheet',
        ...attributes,
    };

    if (!cache) {
        attributes.href = appendQueryString(attributes.href, '_', Date.now(), getDomProperty(context, 'baseURI'));
    }

    const link = callDomMethod(context, 'createElement', 'link');

    for (const [key, value] of Object.entries(attributes)) {
        link.setAttribute(key, value);
    }

    getDomProperty(context, 'head').appendChild(link);

    return new Promise((resolve, reject) => {
        link.onload = () => resolve();
        link.onerror = (error) => reject(error);
    });
}

/**
 * Imports multiple CSS stylesheets.
 * @param {StyleSource[]} urls The stylesheet URLs or attribute objects.
 * @param {StyleLoadOptions} [options] The loading options.
 * @returns {Promise<void[]>} A promise that resolves when every stylesheet loads, or rejects on failure.
 */
export function loadStyles(urls, { cache = true, context = getContext() } = {}) {
    return Promise.all(
        urls.map((url) =>
            isString(url) ?
                loadStyle(url, null, { cache, context }) :
                loadStyle(null, url, { cache, context }),
        ),
    );
}
