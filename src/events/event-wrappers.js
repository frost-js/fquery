/** @import { EventCallback } from './event-handlers.js'; */

import { callDOMMethod, getDOMProperty, isElement, isWindow, merge } from '@fr0st/core';

/**
 * Returns the closest matching delegate before the container boundary.
 * @param {Element|ShadowRoot|Document} node The delegation container.
 * @param {EventTarget|null} target The event target to test.
 * @param {string} selector The delegate query selector.
 * @param {boolean} scoped Whether the selector uses the container as its scope.
 * @returns {Element|undefined} The matching delegate element, or no match.
 */
function getDelegate(node, target, selector, scoped) {
    const matches = scoped ?
        merge([], callDOMMethod(node, 'querySelectorAll', selector)) :
        null;

    while (target && target !== node) {
        if (
            isElement(target) &&
            (matches ? matches.includes(target) : callDOMMethod(target, 'matches', selector))
        ) {
            return target;
        }

        target = getDOMProperty(target, 'parentNode');
    }
};

/**
 * Returns a wrapped event callback that executes on a delegate selector.
 * @param {Element|ShadowRoot|Document|Window} node The input node.
 * @param {string} selector The delegate query selector.
 * @param {EventCallback} callback The event callback.
 * @returns {EventCallback} The delegated event callback.
 */
export function delegateFactory(node, selector, callback) {
    const context = isWindow(node) ? node.document : node;
    const scoped = /:scope\b/i.test(selector);

    return (event) => {
        if (node === event.target) {
            return;
        }

        const delegate = getDelegate(context, event.target, selector, scoped);

        if (!delegate) {
            return;
        }

        Object.defineProperty(event, 'currentTarget', {
            configurable: true,
            enumerable: true,
            value: delegate,
        });
        Object.defineProperty(event, 'delegateTarget', {
            configurable: true,
            enumerable: true,
            value: node,
        });

        try {
            return callback(event);
        } finally {
            delete event.currentTarget;
            delete event.delegateTarget;
        }
    };
};

/**
 * Returns a wrapped event callback that checks for a namespace match.
 * @param {string} eventName The namespaced event name.
 * @param {EventCallback} callback The callback to execute.
 * @returns {EventCallback} The wrapped event callback.
 */
export function namespaceFactory(eventName, callback) {
    return (event) => {
        if ('namespaceRegExp' in event && !event.namespaceRegExp.test(eventName)) {
            return;
        }

        return callback(event);
    };
};

/**
 * Returns a wrapped event callback that prevents the default action when the callback returns false.
 * @param {EventCallback} callback The callback to execute.
 * @returns {EventCallback} The wrapped event callback.
 */
export function preventFactory(callback) {
    return (event) => {
        if (callback(event) === false) {
            event.preventDefault();
        }
    };
};

/**
 * Returns a wrapped callback that performs cleanup before its first execution.
 * @param {EventCallback} callback The callback to execute.
 * @param {() => void} cleanup The cleanup callback.
 * @returns {EventCallback} The wrapped event callback.
 */
export function selfDestructCallbackFactory(callback, cleanup) {
    return (event) => {
        cleanup();
        return callback(event);
    };
};
