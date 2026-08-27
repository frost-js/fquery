/** @import QuerySet from '../query/query-set.js'; */

import { parseNode, parseNodes } from './../filters.js';
import { createEvent, eventNamespacedRegExp, parseEvent, parseEvents } from './../helpers.js';
import { events } from './../vars.js';
import { delegateFactory, delegateFactoryClean, namespaceFactory, preventFactory, selfDestructCallbackFactory } from './event-wrappers.js';

/**
 * @typedef {Element|Document|ShadowRoot|Window} EventTargetNode
 */

/**
 * @typedef {string|EventTargetNode|Array<string|EventTargetNode>|NodeList|HTMLCollection|QuerySet} EventTargetInput
 */

/**
 * @callback EventCallback
 * @param {Event} event The event object.
 * @returns {*} The callback result.
 */

/**
 * @typedef {object} EventOptions
 * @property {boolean} [capture=false] Whether to use event capture.
 * @property {string|null} [delegate=null] The delegate selector.
 * @property {boolean} [passive=false] Whether to use a passive listener.
 * @property {boolean} [selfDestruct=false] Whether to remove the listener before its first execution.
 */

/**
 * @typedef {object} RemoveEventOptions
 * @property {boolean|null} [capture=null] Whether to match event capture. Null matches either mode.
 * @property {string|null} [delegate=null] The delegate selector.
 */

/**
 * @typedef {object} TriggerEventOptions
 * @property {Record<string, *>} [data={}] Additional data assigned to the event.
 * @property {*} [detail] Additional event details.
 * @property {boolean} [bubbles=true] Whether the event bubbles.
 * @property {boolean} [cancelable=true] Whether the event can be cancelled.
 */

/**
 * Adds events to each node.
 * @param {EventTargetInput} selector The input node(s), or a query selector string.
 * @param {string} eventNames The event names.
 * @param {EventCallback} callback The callback to execute.
 * @param {EventOptions} [options] The event options.
 */
export function addEvent(selector, eventNames, callback, { capture = false, delegate = null, passive = false, selfDestruct = false } = {}) {
    const nodes = parseNodes(selector, {
        shadow: true,
        document: true,
        window: true,
    });

    eventNames = parseEvents(eventNames);

    for (const eventName of eventNames) {
        const realEventName = parseEvent(eventName);

        const eventData = {
            callback,
            delegate,
            selfDestruct,
            capture,
            passive,
        };

        for (const node of nodes) {
            if (!events.has(node)) {
                events.set(node, {});
            }

            const nodeEvents = events.get(node);

            let realCallback = callback;

            if (selfDestruct) {
                realCallback = selfDestructCallbackFactory(
                    realCallback,
                    (_) => removeEvent(node, eventName, callback, { capture, delegate }),
                );
            }

            realCallback = preventFactory(realCallback);

            if (delegate) {
                realCallback = delegateFactory(node, delegate, realCallback);
            } else {
                realCallback = delegateFactoryClean(node, realCallback);
            }

            realCallback = namespaceFactory(eventName, realCallback);

            eventData.realCallback = realCallback;
            eventData.eventName = eventName;
            eventData.realEventName = realEventName;

            if (!nodeEvents[realEventName]) {
                nodeEvents[realEventName] = [];
            }

            nodeEvents[realEventName].push({ ...eventData });

            node.addEventListener(realEventName, realCallback, { capture, passive });
        }
    }
};

/**
 * Adds delegated events to each node.
 * @param {EventTargetInput} selector The input node(s), or a query selector string.
 * @param {string} events The event names.
 * @param {string} delegate The delegate selector.
 * @param {EventCallback} callback The callback to execute.
 * @param {EventOptions} [options] The event options.
 */
export function addEventDelegate(selector, events, delegate, callback, { capture = false, passive = false } = {}) {
    addEvent(selector, events, callback, { capture, delegate, passive });
};

/**
 * Adds self-destructing delegated events to each node.
 * @param {EventTargetInput} selector The input node(s), or a query selector string.
 * @param {string} events The event names.
 * @param {string} delegate The delegate selector.
 * @param {EventCallback} callback The callback to execute.
 * @param {EventOptions} [options] The event options.
 */
export function addEventDelegateOnce(selector, events, delegate, callback, { capture = false, passive = false } = {}) {
    addEvent(selector, events, callback, { capture, delegate, passive, selfDestruct: true });
};

/**
 * Adds self-destructing events to each node.
 * @param {EventTargetInput} selector The input node(s), or a query selector string.
 * @param {string} events The event names.
 * @param {EventCallback} callback The callback to execute.
 * @param {EventOptions} [options] The event options.
 */
export function addEventOnce(selector, events, callback, { capture = false, passive = false } = {}) {
    addEvent(selector, events, callback, { capture, passive, selfDestruct: true });
};

/**
 * Clones all events from each node to other nodes.
 * @param {EventTargetInput} selector The input node(s), or a query selector string.
 * @param {EventTargetInput} otherSelector The other node(s), or a query selector string.
 */
export function cloneEvents(selector, otherSelector) {
    const nodes = parseNodes(selector, {
        shadow: true,
        document: true,
        window: true,
    });

    for (const node of nodes) {
        if (!events.has(node)) {
            continue;
        }

        const nodeEvents = events.get(node);

        for (const realEvents of Object.values(nodeEvents)) {
            for (const eventData of realEvents) {
                addEvent(
                    otherSelector,
                    eventData.eventName,
                    eventData.callback,
                    {
                        capture: eventData.capture,
                        delegate: eventData.delegate,
                        passive: eventData.passive,
                        selfDestruct: eventData.selfDestruct,
                    },
                );
            }
        }
    }
};

/**
 * Removes events from each node.
 * @param {EventTargetInput} selector The input node(s), or a query selector string.
 * @param {string} [eventNames] The event names.
 * @param {EventCallback} [callback] The callback to remove.
 * @param {RemoveEventOptions} [options] The removal options.
 */
export function removeEvent(selector, eventNames, callback, { capture = null, delegate = null } = {}) {
    const nodes = parseNodes(selector, {
        shadow: true,
        document: true,
        window: true,
    });

    let eventLookup;
    if (eventNames) {
        eventNames = parseEvents(eventNames);

        eventLookup = {};

        for (const eventName of eventNames) {
            const realEventName = parseEvent(eventName);

            if (!(realEventName in eventLookup)) {
                eventLookup[realEventName] = [];
            }

            eventLookup[realEventName].push(eventName);
        }
    }

    for (const node of nodes) {
        if (!events.has(node)) {
            continue;
        }

        const nodeEvents = events.get(node);

        for (const [realEventName, realEvents] of Object.entries(nodeEvents)) {
            if (eventLookup && !(realEventName in eventLookup)) {
                continue;
            }

            const otherEvents = realEvents.filter((eventData) => {
                if (eventLookup && !eventLookup[realEventName].some((eventName) => {
                    if (eventName === realEventName) {
                        return true;
                    }

                    const regExp = eventNamespacedRegExp(eventName);

                    return eventData.eventName.match(regExp);
                })) {
                    return true;
                }

                if (callback && callback !== eventData.callback) {
                    return true;
                }

                if (delegate && delegate !== eventData.delegate) {
                    return true;
                }

                if (capture !== null && capture !== eventData.capture) {
                    return true;
                }

                node.removeEventListener(realEventName, eventData.realCallback, eventData.capture);

                return false;
            });

            if (!otherEvents.length) {
                delete nodeEvents[realEventName];
            }
        }

        if (!Object.keys(nodeEvents).length) {
            events.delete(node);
        }
    }
};

/**
 * Removes delegated events from each node.
 * @param {EventTargetInput} selector The input node(s), or a query selector string.
 * @param {string} [events] The event names.
 * @param {string} [delegate] The delegate selector.
 * @param {EventCallback} [callback] The callback to remove.
 * @param {RemoveEventOptions} [options] The removal options.
 */
export function removeEventDelegate(selector, events, delegate, callback, { capture = null } = {}) {
    removeEvent(selector, events, callback, { capture, delegate });
};

/**
 * Triggers events on each node.
 * @param {EventTargetInput} selector The input node(s), or a query selector string.
 * @param {string} events The event names.
 * @param {TriggerEventOptions} [options] The event options.
 */
export function triggerEvent(selector, events, { data = null, detail = null, bubbles = true, cancelable = true } = {}) {
    const nodes = parseNodes(selector, {
        shadow: true,
        document: true,
        window: true,
    });

    events = parseEvents(events);

    for (const event of events) {
        const realEvent = parseEvent(event);

        const eventData = createEvent(realEvent, {
            detail,
            bubbles,
            cancelable,
        });

        if (data) {
            Object.assign(eventData, data);
        }

        if (realEvent !== event) {
            eventData.namespace = event.substring(realEvent.length + 1);
            eventData.namespaceRegExp = eventNamespacedRegExp(event);
        }

        for (const node of nodes) {
            node.dispatchEvent(eventData);
        }
    }
};

/**
 * Triggers an event for the first node.
 * @param {EventTargetInput} selector The input node(s), or a query selector string.
 * @param {string} event The event name.
 * @param {TriggerEventOptions} [options] The event options.
 * @returns {boolean} Whether the event was dispatched without cancellation.
 */
export function triggerOne(selector, event, { data = null, detail = null, bubbles = true, cancelable = true } = {}) {
    const node = parseNode(selector, {
        shadow: true,
        document: true,
        window: true,
    });

    const realEvent = parseEvent(event);

    const eventData = createEvent(realEvent, {
        detail,
        bubbles,
        cancelable,
    });

    if (data) {
        Object.assign(eventData, data);
    }

    if (realEvent !== event) {
        eventData.namespace = event.substring(realEvent.length + 1);
        eventData.namespaceRegExp = eventNamespacedRegExp(event);
    }

    return node.dispatchEvent(eventData);
};
