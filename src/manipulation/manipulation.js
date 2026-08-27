/** @import { NodeInput } from '../helpers.js'; */

import { isElement, isFragment, isNode, isShadow, merge } from '@fr0st/core';
import { addEvent } from './../events/event-handlers.js';
import { parseNodes } from './../filters.js';
import { createEvent } from './../helpers.js';
import { animations as _animations, data as _data, events as _events, queues, styles } from './../vars.js';
import { createFragment } from './create.js';

/**
 * @typedef {object} CloneOptions
 * @property {boolean} [deep=true] Whether to also clone all descendant nodes.
 * @property {boolean} [events=false] Whether to also clone events.
 * @property {boolean} [data=false] Whether to also clone custom data.
 * @property {boolean} [animations=false] Whether to also clone animations.
 */

/**
 * Clones each node.
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @param {CloneOptions} [options] The cloning options.
 * @returns {Node[]} The cloned nodes.
 */
export function clone(selector, { deep = true, events = false, data = false, animations = false } = {}) {
    // ShadowRoot nodes can not be cloned
    const nodes = parseNodes(selector, {
        node: true,
        fragment: true,
    });

    return nodes.map((node) => {
        const clone = node.cloneNode(deep);

        if (events || data || animations) {
            deepClone(node, clone, { deep, events, data, animations });
        }

        return clone;
    });
};

/**
 * Deep-clones a single node.
 * @param {Node|DocumentFragment} node The node.
 * @param {Node|DocumentFragment} clone The clone.
 * @param {CloneOptions} [options] The cloning options.
 */
function deepClone(node, clone, { deep = true, events = false, data = false, animations = false } = {}) {
    if (events && _events.has(node)) {
        const nodeEvents = _events.get(node);

        for (const realEvents of Object.values(nodeEvents)) {
            for (const eventData of realEvents) {
                addEvent(
                    clone,
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

    if (data && _data.has(node)) {
        const nodeData = _data.get(node);
        _data.set(clone, { ...nodeData });
    }

    if (animations && _animations.has(node)) {
        const nodeAnimations = _animations.get(node);

        for (const animation of nodeAnimations) {
            animation.clone(clone);
        }
    }

    if (deep) {
        for (const [i, child] of node.childNodes.entries()) {
            const childClone = clone.childNodes.item(i);
            deepClone(child, childClone, { deep, events, data, animations });
        }
    }
};

/**
 * Detaches each node from the DOM.
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @returns {Node[]} The detached nodes.
 */
export function detach(selector) {
    // DocumentFragment and ShadowRoot nodes can not be detached
    const nodes = parseNodes(selector, {
        node: true,
    });

    for (const node of nodes) {
        node.remove();
    }

    return nodes;
};

/**
 * Removes all children of each node from the DOM.
 * @param {NodeInput} selector The input node(s), or a query selector string.
 */
export function empty(selector) {
    const nodes = parseNodes(selector, {
        fragment: true,
        shadow: true,
        document: true,
    });

    for (const node of nodes) {
        const childNodes = merge([], node.childNodes);

        // Remove descendant elements
        for (const child of childNodes) {
            if (isElement(child) || isFragment(child) || isShadow(child)) {
                removeNode(child);
            }

            child.remove();
        }

        // Remove ShadowRoot
        if (node.shadowRoot) {
            removeNode(node.shadowRoot);
        }

        // Remove DocumentFragment
        if (node.content) {
            removeNode(node.content);
        }
    }
};

/**
 * Removes each node from the DOM.
 * @param {NodeInput} selector The input node(s), or a query selector string.
 */
export function remove(selector) {
    const nodes = parseNodes(selector, {
        node: true,
        fragment: true,
        shadow: true,
    });

    for (const node of nodes) {
        if (isElement(node) || isFragment(node) || isShadow(node)) {
            removeNode(node);
        }

        // DocumentFragment and ShadowRoot nodes can not be removed
        if (isNode(node)) {
            node.remove();
        }
    }
};

/**
 * Removes all data for a single node.
 * @param {Node} node The node.
 */
export function removeNode(node) {
    if (_events.has(node)) {
        const nodeEvents = _events.get(node);

        if ('remove' in nodeEvents) {
            const eventData = createEvent('remove', {
                bubbles: false,
                cancelable: false,
            });

            node.dispatchEvent(eventData);
        }

        for (const [realEventName, realEvents] of Object.entries(nodeEvents)) {
            for (const eventData of realEvents) {
                node.removeEventListener(realEventName, eventData.realCallback, { capture: eventData.capture });
            }
        }

        _events.delete(node);
    }

    if (queues.has(node)) {
        queues.delete(node);
    }

    if (_animations.has(node)) {
        const nodeAnimations = _animations.get(node);
        for (const animation of nodeAnimations) {
            animation.stop();
        }
    }

    if (styles.has(node)) {
        styles.delete(node);
    }

    if (_data.has(node)) {
        _data.delete(node);
    }

    // Remove descendant elements
    const childNodes = merge([], node.children);

    for (const child of childNodes) {
        removeNode(child);
    }

    // Remove ShadowRoot
    if (node.shadowRoot) {
        removeNode(node.shadowRoot);
    }

    // Remove DocumentFragment
    if (node.content) {
        removeNode(node.content);
    }
};

/**
 * Replaces each other node with nodes.
 * @param {NodeInput} selector The input node(s), or a query selector or HTML string.
 * @param {NodeInput} otherSelector The input node(s), or a query selector string.
 */
export function replaceAll(selector, otherSelector) {
    replaceWith(otherSelector, selector);
};

/**
 * Replaces each node with other nodes.
 * @param {NodeInput} selector The input node(s), or a query selector string.
 * @param {NodeInput} otherSelector The input node(s), or a query selector or HTML string.
 */
export function replaceWith(selector, otherSelector) {
    // DocumentFragment and ShadowRoot nodes can not be removed
    let nodes = parseNodes(selector, {
        node: true,
    });

    // ShadowRoot nodes can not be cloned
    let others = parseNodes(otherSelector, {
        node: true,
        fragment: true,
        html: true,
    });

    // Move nodes to a fragment so they don't get removed
    const fragment = createFragment();

    for (const other of others) {
        fragment.insertBefore(other, null);
    }

    others = merge([], fragment.childNodes);

    nodes = nodes.filter((node) =>
        !others.includes(node) &&
        !nodes.some((other) =>
            !other.isSameNode(node) &&
            other.contains(node),
        ),
    );

    for (const [i, node] of nodes.entries()) {
        const parent = node.parentNode;

        if (!parent) {
            continue;
        }

        let clones;
        if (i === nodes.length - 1) {
            clones = others;
        } else {
            clones = clone(others, {
                events: true,
                data: true,
                animations: true,
            });
        }

        for (const clone of clones) {
            parent.insertBefore(clone, node);
        }
    }

    remove(nodes);
};
