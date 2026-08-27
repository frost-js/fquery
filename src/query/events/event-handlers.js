/** @import { EventCallback } from '../../events/event-handlers.js'; */
/** @import { EventOptions } from '../../events/event-handlers.js'; */
/** @import { EventTargetInput } from '../../events/event-handlers.js'; */
/** @import QuerySet from '../query-set.js'; */
/** @import { RemoveEventOptions } from '../../events/event-handlers.js'; */
/** @import { TriggerEventOptions } from '../../events/event-handlers.js'; */

import { addEvent as _addEvent, addEventDelegate as _addEventDelegate, addEventDelegateOnce as _addEventDelegateOnce, addEventOnce as _addEventOnce, cloneEvents as _cloneEvents, removeEvent as _removeEvent, removeEventDelegate as _removeEventDelegate, triggerEvent as _triggerEvent, triggerOne as _triggerOne } from './../../events/event-handlers.js';

/**
 * Adds an event to each node.
 * @param {string} events The event names.
 * @param {EventCallback} callback The callback to execute.
 * @param {EventOptions} [options] The event options.
 * @returns {QuerySet} The QuerySet object.
 */
export function addEvent(events, callback, { capture = false, passive = false } = {}) {
    _addEvent(this, events, callback, { capture, passive });

    return this;
};

/**
 * Adds a delegated event to each node.
 * @param {string} events The event names.
 * @param {string} delegate The delegate selector.
 * @param {EventCallback} callback The callback to execute.
 * @param {EventOptions} [options] The event options.
 * @returns {QuerySet} The QuerySet object.
 */
export function addEventDelegate(events, delegate, callback, { capture = false, passive = false } = {}) {
    _addEventDelegate(this, events, delegate, callback, { capture, passive });

    return this;
};

/**
 * Adds a self-destructing delegated event to each node.
 * @param {string} events The event names.
 * @param {string} delegate The delegate selector.
 * @param {EventCallback} callback The callback to execute.
 * @param {EventOptions} [options] The event options.
 * @returns {QuerySet} The QuerySet object.
 */
export function addEventDelegateOnce(events, delegate, callback, { capture = false, passive = false } = {}) {
    _addEventDelegateOnce(this, events, delegate, callback, { capture, passive });

    return this;
};

/**
 * Adds a self-destructing event to each node.
 * @param {string} events The event names.
 * @param {EventCallback} callback The callback to execute.
 * @param {EventOptions} [options] The event options.
 * @returns {QuerySet} The QuerySet object.
 */
export function addEventOnce(events, callback, { capture = false, passive = false } = {}) {
    _addEventOnce(this, events, callback, { capture, passive });

    return this;
};

/**
 * Clones all events from each node to other nodes.
 * @param {EventTargetInput} otherSelector The other node(s), or a query selector string.
 * @returns {QuerySet} The QuerySet object.
 */
export function cloneEvents(otherSelector) {
    _cloneEvents(this, otherSelector);

    return this;
};

/**
 * Removes events from each node.
 * @param {string} [events] The event names.
 * @param {EventCallback} [callback] The callback to remove.
 * @param {RemoveEventOptions} [options] The removal options.
 * @returns {QuerySet} The QuerySet object.
 */
export function removeEvent(events, callback, { capture = null } = {}) {
    _removeEvent(this, events, callback, { capture });

    return this;
};

/**
 * Removes delegated events from each node.
 * @param {string} [events] The event names.
 * @param {string} [delegate] The delegate selector.
 * @param {EventCallback} [callback] The callback to remove.
 * @param {RemoveEventOptions} [options] The removal options.
 * @returns {QuerySet} The QuerySet object.
 */
export function removeEventDelegate(events, delegate, callback, { capture = null } = {}) {
    _removeEventDelegate(this, events, delegate, callback, { capture });

    return this;
};

/**
 * Triggers events on each node.
 * @param {string} events The event names.
 * @param {TriggerEventOptions} [options] The event options.
 * @returns {QuerySet} The QuerySet object.
 */
export function triggerEvent(events, { data = null, detail = null, bubbles = true, cancelable = true } = {}) {
    _triggerEvent(this, events, { data, detail, bubbles, cancelable });

    return this;
};

/**
 * Triggers an event for the first node.
 * @param {string} event The event name.
 * @param {TriggerEventOptions} [options] The event options.
 * @returns {boolean} Whether the event was dispatched without cancellation.
 */
export function triggerOne(event, { data = null, detail = null, bubbles = true, cancelable = true } = {}) {
    return _triggerOne(this, event, { data, detail, bubbles, cancelable });
};
