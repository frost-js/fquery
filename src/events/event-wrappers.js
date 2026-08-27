/** @import { EventCallback } from './event-handlers.js'; */

import { merge } from '@fr0st/core';
import { closest } from './../traversal/traversal.js';

/**
 * @callback DelegateCallback
 * @param {Element} target The event target to test.
 * @returns {Element|false|undefined} The matching delegate element, or no match.
 */

/**
 * Returns a function for matching a delegate target to a custom selector.
 * @param {Element|ShadowRoot|Document} node The input node.
 * @param {string} selector The delegate query selector.
 * @returns {DelegateCallback} The callback for finding the matching delegate.
 */
function getDelegateContainsFactory(node, selector) {
    return (target) => {
        const matches = merge([], node.querySelectorAll(selector));

        if (!matches.length) {
            return false;
        }

        if (matches.includes(target)) {
            return target;
        }

        return closest(
            target,
            (parent) => matches.includes(parent),
            (parent) => parent.isSameNode(node),
        ).shift();
    };
};

/**
 * Returns a function for matching a delegate target to a standard selector.
 * @param {Element|ShadowRoot|Document} node The input node.
 * @param {string} selector The delegate query selector.
 * @returns {DelegateCallback} The callback for finding the matching delegate.
 */
function getDelegateMatchFactory(node, selector) {
    return (target) =>
        target.matches && target.matches(selector) ?
            target :
            closest(
                target,
                (parent) => parent.matches(selector),
                (parent) => parent.isSameNode(node),
            ).shift();
};

/**
 * Returns a wrapped event callback that executes on a delegate selector.
 * @param {Element|ShadowRoot|Document} node The input node.
 * @param {string} selector The delegate query selector.
 * @param {EventCallback} callback The event callback.
 * @returns {EventCallback} The delegated event callback.
 */
export function delegateFactory(node, selector, callback) {
    const getDelegate = selector.match(/(?:^\s*:scope|,(?=(?:(?:[^"']*["']){2})*[^"']*$)\s*:scope)/) ?
        getDelegateContainsFactory(node, selector) :
        getDelegateMatchFactory(node, selector);

    return (event) => {
        if (node.isSameNode(event.target)) {
            return;
        }

        const delegate = getDelegate(event.target);

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

        return callback(event);
    };
};

/**
 * Returns a wrapped event callback that cleans up delegate events.
 * @param {Element|ShadowRoot|Document} node The input node.
 * @param {EventCallback} callback The event callback.
 * @returns {EventCallback} The cleaned event callback.
 */
export function delegateFactoryClean(node, callback) {
    return (event) => {
        if (!event.delegateTarget) {
            return callback(event);
        }

        Object.defineProperty(event, 'currentTarget', {
            configurable: true,
            enumerable: true,
            value: node,
        });
        Object.defineProperty(event, 'delegateTarget', {
            writable: true,
        });

        delete event.delegateTarget;

        return callback(event);
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
