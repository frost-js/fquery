import { callDomMethod, getDomProperty, isString } from '@fr0st/core';
import { appendQueryString } from './../ajax/helpers.js';
import { getContext } from './../config.js';

/** @typedef {Record<string, *>} ScriptAttributes */

/** @typedef {string|ScriptAttributes} ScriptSource */

/**
 * @typedef {object} ScriptLoadOptions
 * @property {boolean} [cache=true] Whether to cache the request.
 * @property {Document} [context] The document context. Defaults to the configured context.
 */

/**
 * Checks whether a boolean attribute should be enabled.
 * @param {*} value The attribute value.
 * @returns {boolean} True if the attribute should be enabled.
 */
function isEnabled(value) {
    return value !== false && value !== null && typeof value !== 'undefined';
};

/**
 * Applies a script attribute if it should be serialized.
 * @param {HTMLScriptElement} script The script element.
 * @param {string} key The attribute key.
 * @param {*} value The attribute value.
 */
function setScriptAttribute(script, key, value) {
    if (key === 'async' || !isEnabled(value)) {
        return;
    }

    script.setAttribute(key, value === true ? '' : value);
};

/**
 * Loads and executes a JavaScript file.
 * @param {string|null} url The URL of the script.
 * @param {ScriptAttributes} [attributes] Additional attributes to set on the script element.
 * @param {ScriptLoadOptions} [options] The loading options.
 * @returns {Promise<void>} A promise that resolves when the script loads, or rejects on failure.
 */
export function loadScript(url, attributes, { cache = true, context = getContext() } = {}) {
    attributes = {
        src: url,
        type: 'text/javascript',
        ...attributes,
    };

    if (!cache) {
        attributes.src = appendQueryString(attributes.src, '_', Date.now(), getDomProperty(context, 'baseURI'));
    }

    const script = callDomMethod(context, 'createElement', 'script');

    // Dynamically inserted scripts execute in insertion order only when async is disabled.
    script.async = 'async' in attributes ?
        isEnabled(attributes.async) :
        false;

    for (const [key, value] of Object.entries(attributes)) {
        setScriptAttribute(script, key, value);
    }

    getDomProperty(context, 'head').appendChild(script);

    return new Promise((resolve, reject) => {
        script.onload = (_) => resolve();
        script.onerror = (error) => reject(error);
    });
};

/**
 * Loads and executes multiple JavaScript files (in order).
 * @param {ScriptSource[]} urls The script URLs or attribute objects.
 * @param {ScriptLoadOptions} [options] The loading options.
 * @returns {Promise<void[]>} A promise that resolves when every script loads, or rejects on failure.
 */
export function loadScripts(urls, { cache = true, context = getContext() } = {}) {
    return Promise.all(
        urls.map((url) =>
            isString(url) ?
                loadScript(url, null, { cache, context }) :
                loadScript(null, url, { cache, context }),
        ),
    );
};
