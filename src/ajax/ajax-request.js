import { extend, isObject } from '@fr0st/core';
import { getAjaxDefaults, getWindow } from './../config.js';
import { appendQueryString, createSearchParams, createUrl, mergeHeaders, parseFormData, parseParams } from './helpers.js';

/**
 * @typedef {boolean|string|Array<*>|Record<string, *>|FormData|null} AjaxData
 */

/**
 * @callback AjaxHook
 * @param {XMLHttpRequest} xhr The request object.
 * @returns {void} Nothing.
 */

/**
 * @callback AjaxProgressCallback
 * @param {number} progress The completion ratio from 0 to 1.
 * @param {XMLHttpRequest} xhr The request object.
 * @param {ProgressEvent} event The progress event.
 * @returns {void} Nothing.
 */

/**
 * @typedef {object} AjaxOptions
 * @property {string} [url] The request URL. Defaults to the current location.
 * @property {string} [method='GET'] The HTTP method.
 * @property {AjaxData} [data=null] The request data.
 * @property {string|false} [contentType='application/x-www-form-urlencoded'] The request content type, or false to omit it.
 * @property {XMLHttpRequestResponseType|null} [responseType=null] The response type.
 * @property {string} [mimeType] The MIME type override.
 * @property {string} [username] The authentication username.
 * @property {string} [password] The authentication password.
 * @property {number} [timeout=0] The timeout in milliseconds.
 * @property {boolean|null} [isLocal=null] Whether to treat the request as local. Null enables automatic detection.
 * @property {boolean} [cache=true] Whether to cache the request.
 * @property {boolean} [processData=true] Whether to encode the request data.
 * @property {boolean} [rejectOnCancel=true] Whether cancellation rejects the request promise.
 * @property {Record<string, string>} [headers={}] Additional request headers.
 * @property {AjaxHook|null} [afterSend=null] The callback invoked after sending.
 * @property {AjaxHook|null} [beforeSend=null] The callback invoked before sending.
 * @property {AjaxProgressCallback|null} [onProgress=null] The download progress callback.
 * @property {AjaxProgressCallback|null} [onUploadProgress=null] The upload progress callback.
 * @property {() => XMLHttpRequest} [xhr] The request factory.
 */

/**
 * @typedef {object} AjaxResult
 * @property {*} response The response value.
 * @property {XMLHttpRequest} xhr The request object.
 * @property {ProgressEvent} event The load event.
 */

/**
 * @typedef {object} AjaxError
 * @property {number} status The HTTP status.
 * @property {XMLHttpRequest} xhr The request object.
 * @property {ProgressEvent} [event] The failure event.
 * @property {string} [reason] The cancellation reason.
 */

/**
 * Represents a cancellable XMLHttpRequest with Promise-compatible methods.
 */
export default class AjaxRequest {
    #isCancelled;
    #isRejected;
    #isResolved;
    #options;
    #promise;
    #reject;
    #resolve;

    /**
     * Creates an AJAX request.
     * @param {AjaxOptions} [options] The request options.
     */
    constructor(options) {
        const { location } = getWindow();
        const defaults = getAjaxDefaults();

        this.#options = extend(
            {},
            defaults,
            options,
        );
        this.#options.method = this.#options.method.toUpperCase();

        const isFormData = Object.prototype.toString.call(this.#options.data) === '[object FormData]';

        if (!this.#options.url) {
            this.#options.url = location.href;
        }

        if (!this.#options.cache) {
            this.#options.url = appendQueryString(this.#options.url, '_', Date.now());
        }

        if (this.#options.isLocal === null) {
            this.#options.isLocal = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(location.protocol);
        }

        const headers = {};

        if (!isFormData && this.#options.contentType) {
            headers['Content-Type'] = this.#options.contentType;
        }

        if (!this.#options.isLocal) {
            headers['X-Requested-With'] = 'XMLHttpRequest';
        }

        this.#options.headers = mergeHeaders(headers, defaults.headers, options?.headers);

        this.#promise = new Promise((resolve, reject) => {
            this.#resolve = (value) => {
                this.#isResolved = true;
                resolve(value);
            };

            this.#reject = (error) => {
                this.#isRejected = true;
                reject(error);
            };
        });

        this.xhr = this.#options.xhr();

        if (this.#options.data !== null && this.#options.data !== undefined) {
            if (!isFormData && this.#options.processData && isObject(this.#options.data)) {
                const contentTypeHeader = Object.entries(this.#options.headers)
                    .find(([key]) => key.toLowerCase() === 'content-type')?.[1];

                const contentType = (contentTypeHeader || '').split(';')[0].trim().toLowerCase();

                if (['GET', 'HEAD'].includes(this.#options.method) || contentType === 'application/x-www-form-urlencoded') {
                    this.#options.data = parseParams(this.#options.data);
                } else if (contentType === 'application/json') {
                    this.#options.data = JSON.stringify(this.#options.data);
                } else {
                    this.#options.data = parseFormData(this.#options.data);
                }
            }

            if (['GET', 'HEAD'].includes(this.#options.method)) {
                const dataParams = createSearchParams(this.#options.data);
                const urlData = createUrl(this.#options.url);

                for (const [key, value] of dataParams.entries()) {
                    urlData.searchParams.append(key, value);
                }

                // Preserve query normalization even when the supplied data is empty.
                urlData.search = urlData.searchParams.toString();
                this.#options.url = urlData.toString();
                this.#options.data = null;
            }
        }

        this.xhr.open(this.#options.method, this.#options.url, true, this.#options.username, this.#options.password);

        for (const [key, value] of Object.entries(this.#options.headers)) {
            this.xhr.setRequestHeader(key, value);
        }

        if (this.#options.responseType) {
            this.xhr.responseType = this.#options.responseType;
        }

        if (this.#options.mimeType) {
            this.xhr.overrideMimeType(this.#options.mimeType);
        }

        if (this.#options.timeout) {
            this.xhr.timeout = this.#options.timeout;
        }

        this.xhr.onload = (e) => {
            if (this.xhr.status >= 400) {
                this.#reject({
                    status: this.xhr.status,
                    xhr: this.xhr,
                    event: e,
                });
            } else {
                this.#resolve({
                    response: this.xhr.response,
                    xhr: this.xhr,
                    event: e,
                });
            }
        };

        this.xhr.onabort = () => this.cancel();

        this.xhr.onerror = (e) =>
            this.#reject({
                status: this.xhr.status,
                xhr: this.xhr,
                event: e,
            });

        this.xhr.ontimeout = (e) =>
            this.#reject({
                status: this.xhr.status,
                xhr: this.xhr,
                event: e,
            });

        if (this.#options.onProgress) {
            this.xhr.onprogress = (e) =>
                this.#options.onProgress(e.loaded / e.total, this.xhr, e);
        }

        if (this.#options.onUploadProgress) {
            this.xhr.upload.onprogress = (e) =>
                this.#options.onUploadProgress(e.loaded / e.total, this.xhr, e);
        }

        if (this.#options.beforeSend) {
            this.#options.beforeSend(this.xhr);
        }

        this.xhr.send(this.#options.data);

        if (this.#options.afterSend) {
            this.#options.afterSend(this.xhr);
        }
    }

    /**
     * Cancels a pending request.
     * @param {string} [reason='Request was cancelled'] The cancellation reason.
     */
    cancel(reason = 'Request was cancelled') {
        if (this.#isResolved || this.#isRejected || this.#isCancelled) {
            return;
        }

        this.#isCancelled = true;

        this.xhr.abort();

        if (this.#options.rejectOnCancel) {
            this.#reject({
                status: this.xhr.status,
                xhr: this.xhr,
                reason,
            });
        }
    }

    /**
     * Executes a callback if the request is rejected.
     * @param {((reason: AjaxError) => *)} [onRejected] The callback to execute if the request is rejected.
     * @returns {Promise<*>} The resulting promise.
     */
    catch(onRejected) {
        return this.#promise.catch(onRejected);
    }

    /**
     * Executes a callback once the request is settled (resolved or rejected).
     * @param {(() => void)} [onFinally] The callback to execute once the request is settled.
     * @returns {Promise<AjaxResult>} The resulting promise.
     */
    finally(onFinally) {
        return this.#promise.finally(onFinally);
    }

    /**
     * Executes a callback once the request is resolved (or optionally rejected).
     * @param {((value: AjaxResult) => *)} onFulfilled The callback to execute if the request is resolved.
     * @param {((reason: AjaxError) => *)} [onRejected] The callback to execute if the request is rejected.
     * @returns {Promise<*>} The resulting promise.
     */
    then(onFulfilled, onRejected) {
        return this.#promise.then(onFulfilled, onRejected);
    }
}

Object.setPrototypeOf(AjaxRequest.prototype, Promise.prototype);
