import { getDOMProperty, isArray, isObject, isUndefined } from '@fr0st/core';
import { getWindow } from './../config.js';

/** @typedef {{name: string, value: *}} FormEntry */

/** @typedef {FormEntry[]|Record<string, *>} FormInput */

/** @typedef {[string, *]} ParamEntry */

/**
 * Appends a query string to a URL.
 * @param {string} url The input URL.
 * @param {string} key The query string key.
 * @param {string|number} value The query string value.
 * @param {string} [baseURI] The base URI. Defaults to the configured window's document base URI.
 * @returns {string} The new URL.
 */
export function appendQueryString(url, key, value, baseURI) {
    const searchParams = getSearchParams(url, baseURI);

    searchParams.append(key, value);

    return setSearchParams(url, searchParams, baseURI);
};

/**
 * Creates URLSearchParams from input data.
 * @param {*} data The input data.
 * @returns {URLSearchParams} The URLSearchParams.
 */
export function createSearchParams(data) {
    const { URLSearchParams } = getWindow();

    return new URLSearchParams(data);
};

/**
 * Creates a URL from a URL string.
 * @param {string} url The URL.
 * @param {string} [baseURI] The base URI. Defaults to the configured window's document base URI.
 * @returns {URL} The URL.
 */
export function createUrl(url, baseURI = getDOMProperty(getWindow().document, 'baseURI')) {
    const { URL } = getWindow();

    return new URL(url, baseURI);
};

/**
 * Gets the URLSearchParams from a URL string.
 * @param {string} url The URL.
 * @param {string} [baseURI] The base URI. Defaults to the configured window's document base URI.
 * @returns {URLSearchParams} The URLSearchParams.
 */
export function getSearchParams(url, baseURI) {
    return createUrl(url, baseURI).searchParams;
};

/**
 * Merges headers case-insensitively, preserving the last value and spelling.
 * @param {...(Record<string, string>|null|undefined)} sources The header collections, in precedence order.
 * @returns {Record<string, string>} The merged headers.
 */
export function mergeHeaders(...sources) {
    const headers = new Map();

    for (const source of sources) {
        for (const [key, value] of Object.entries(source || {})) {
            headers.set(key.toLowerCase(), [key, value]);
        }
    }

    return Object.fromEntries(headers.values());
};

/**
 * Returns a FormData object from form entries or a data object.
 * @param {FormInput} data The input data.
 * @returns {FormData} The parsed FormData object.
 */
export function parseFormData(data) {
    const { FormData } = getWindow();
    const values = parseValues(data);

    const formData = new FormData;

    for (const [key, value] of values) {
        formData.append(key, value);
    }

    return formData;
};

/**
 * Returns a URI-encoded attribute string from form entries or a data object.
 * @param {FormInput} data The input data.
 * @returns {string} The URI-encoded attribute string.
 */
export function parseParams(data) {
    const values = parseValues(data);

    const paramString = values
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    return paramString;
};

/**
 * Returns flattened parameter entries for a key and value.
 * @param {string} key The input key.
 * @param {*} [value] The input value.
 * @returns {ParamEntry[]} The parsed parameter entries.
 */
function parseValue(key, value) {
    if (value === null || isUndefined(value)) {
        return [];
    }

    if (isArray(value)) {
        if (key.substring(key.length - 2) !== '[]') {
            key += '[]';
        }

        return value.flatMap((val) => parseValue(key, val));
    }

    if (isObject(value)) {
        return Object.entries(value)
            .flatMap(([subKey, val]) => parseValue(`${key}[${subKey}]`, val));
    }

    return [[key, value]];
};

/**
 * Returns flattened parameter entries from form entries or a data object.
 * @param {FormInput} data The input data.
 * @returns {ParamEntry[]} The parsed parameter entries.
 */
function parseValues(data) {
    if (isArray(data)) {
        return data.flatMap((value) => parseValue(value.name, value.value));
    }

    if (isObject(data)) {
        return Object.entries(data)
            .flatMap(([key, value]) => parseValue(key, value));
    }

    return data;
};

/**
 * Sets the URLSearchParams for a URL string.
 * @param {string} url The URL.
 * @param {URLSearchParams} searchParams The URLSearchParams.
 * @param {string} [baseURI] The base URI. Defaults to the configured window's document base URI.
 * @returns {string} The new URL string.
 */
export function setSearchParams(url, searchParams, baseURI) {
    const urlData = createUrl(url, baseURI);

    urlData.search = searchParams.toString();

    return urlData.toString();
};
