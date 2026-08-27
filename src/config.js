/** @import { AjaxOptions } from './ajax/ajax-request.js'; */
/** @import { AnimationOptions } from './animation/animation.js'; */

import { extend, isDocument, isWindow } from '@fr0st/core';

const ajaxDefaults = {
    afterSend: null,
    beforeSend: null,
    cache: true,
    contentType: 'application/x-www-form-urlencoded',
    data: null,
    headers: {},
    isLocal: null,
    method: 'GET',
    onProgress: null,
    onUploadProgress: null,
    processData: true,
    rejectOnCancel: true,
    responseType: null,
    url: null,
    xhr: (_) => {
        const { XMLHttpRequest } = getWindow();
        return new XMLHttpRequest;
    },
};

const animationDefaults = {
    duration: 1000,
    type: 'ease-in-out',
    infinite: false,
    debug: false,
};

export const config = {
    ajaxDefaults,
    animationDefaults,
    context: null,
    useTimeout: false,
    window: null,
};

/**
 * Gets the AJAX defaults.
 * @returns {AjaxOptions} The AJAX defaults.
 */
export function getAjaxDefaults() {
    return ajaxDefaults;
};

/**
 * Gets the animation defaults.
 * @returns {AnimationOptions} The animation defaults.
 */
export function getAnimationDefaults() {
    return animationDefaults;
};

/**
 * Gets the document context.
 * @returns {Document} The document context.
 */
export function getContext() {
    return config.context;
};

/**
 * Gets the window.
 * @returns {Window} The window.
 */
export function getWindow() {
    return config.window;
};

/**
 * Sets the AJAX defaults.
 * @param {Partial<AjaxOptions>} options The AJAX default options.
 */
export function setAjaxDefaults(options) {
    extend(ajaxDefaults, options);
};

/**
 * Sets the animation defaults.
 * @param {Partial<AnimationOptions>} options The animation default options.
 */
export function setAnimationDefaults(options) {
    extend(animationDefaults, options);
};

/**
 * Sets the document context.
 * @param {Document} context The document context.
 * @throws {Error} When context is not a Document.
 */
export function setContext(context) {
    if (!isDocument(context)) {
        throw new Error('fQuery requires a valid Document.');
    }

    config.context = context;
};

/**
 * Sets the window.
 * @param {Window} window The window.
 * @throws {Error} When window is not a Window.
 */
export function setWindow(window) {
    if (!isWindow(window)) {
        throw new Error('fQuery requires a valid Window.');
    }

    config.window = window;
};

/**
 * Sets whether animations should use setTimeout.
 * @param {boolean} [enable=true] Whether animations should use setTimeout.
 */
export function useTimeout(enable = true) {
    config.useTimeout = enable;
};
