/** @import { AjaxData } from './ajax-request.js'; */
/** @import { AjaxOptions } from './ajax-request.js'; */

import AjaxRequest from './ajax-request.js';

/**
 * Performs an XHR DELETE request.
 * @param {string|null} [url] The request URL.
 * @param {AjaxOptions} [options] The request options. The method defaults to `DELETE`.
 * @returns {AjaxRequest} A new AjaxRequest that resolves when the request is completed, or rejects on failure.
 */
export function _delete(url, options) {
    return new AjaxRequest({
        url,
        method: 'DELETE',
        ...options,
    });
};

/**
 * Creates an AJAX request.
 * @param {AjaxOptions} [options] The request options.
 * @returns {AjaxRequest} A new AjaxRequest that resolves when the request is completed, or rejects on failure.
 */
export function ajax(options) {
    return new AjaxRequest(options);
};

/**
 * Performs an XHR GET request.
 * @param {string|null} [url] The request URL.
 * @param {AjaxData} [data] The request data.
 * @param {AjaxOptions} [options] The request options.
 * @returns {AjaxRequest} A new AjaxRequest that resolves when the request is completed, or rejects on failure.
 */
export function get(url, data, options) {
    return new AjaxRequest({
        url,
        data,
        ...options,
    });
};

/**
 * Performs an XHR PATCH request.
 * @param {string|null} [url] The request URL.
 * @param {AjaxData} [data] The request data.
 * @param {AjaxOptions} [options] The request options. The method defaults to `PATCH`.
 * @returns {AjaxRequest} A new AjaxRequest that resolves when the request is completed, or rejects on failure.
 */
export function patch(url, data, options) {
    return new AjaxRequest({
        url,
        data,
        method: 'PATCH',
        ...options,
    });
};

/**
 * Performs an XHR POST request.
 * @param {string|null} [url] The request URL.
 * @param {AjaxData} [data] The request data.
 * @param {AjaxOptions} [options] The request options. The method defaults to `POST`.
 * @returns {AjaxRequest} A new AjaxRequest that resolves when the request is completed, or rejects on failure.
 */
export function post(url, data, options) {
    return new AjaxRequest({
        url,
        data,
        method: 'POST',
        ...options,
    });
};

/**
 * Performs an XHR PUT request.
 * @param {string|null} [url] The request URL.
 * @param {AjaxData} [data] The request data.
 * @param {AjaxOptions} [options] The request options. The method defaults to `PUT`.
 * @returns {AjaxRequest} A new AjaxRequest that resolves when the request is completed, or rejects on failure.
 */
export function put(url, data, options) {
    return new AjaxRequest({
        url,
        data,
        method: 'PUT',
        ...options,
    });
};
