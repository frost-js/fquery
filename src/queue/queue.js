/** @import { ElementInput } from '../helpers.js'; */

import { getWindow } from './../config.js';
import { parseNodes } from './../filters.js';
import { queues } from './../vars.js';

/**
 * @callback QueueCallback
 * @param {Element} node The queued element.
 * @returns {*|Promise<*>} The callback result.
 */

/**
 * @typedef {object} QueueOptions
 * @property {string} [queueName='default'] The queue name.
 */

/**
 * @typedef {object} ClearQueueOptions
 * @property {string|null} [queueName='default'] The queue name. Null addresses every queue.
 */

/**
 * Clears the queue of each node.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {ClearQueueOptions} [options] The queue clearing options.
 */
export function clearQueue(selector, { queueName = 'default' } = {}) {
    const nodes = parseNodes(selector);

    for (const node of nodes) {
        if (!queues.has(node)) {
            continue;
        }

        const queue = queues.get(node);

        if (queueName !== null) {
            queue.delete(queueName);
        }

        if (queueName === null || !queue.size) {
            queues.delete(node);
        }
    }
};

/**
 * Runs the next callback for a single node.
 * @param {Element} node The input node.
 * @param {QueueOptions} [options] The queue options.
 */
function dequeue(node, { queueName = 'default' } = {}) {
    const queue = queues.get(node);

    if (!queue || !queue.has(queueName)) {
        return;
    }

    const callbacks = queue.get(queueName);
    const next = callbacks.shift();

    if (!next) {
        queue.delete(queueName);

        if (!queue.size && queues.get(node) === queue) {
            queues.delete(node);
        }

        return;
    }

    Promise.resolve(next(node))
        .then((_) => {
            if (queues.get(node) === queue && queue.get(queueName) === callbacks) {
                dequeue(node, { queueName });
            }
        }).catch((_) => {
            if (queues.get(node) === queue && queue.get(queueName) === callbacks) {
                queue.delete(queueName);

                if (!queue.size) {
                    queues.delete(node);
                }
            }
        });
};

/**
 * Queues a callback on each node.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {QueueCallback} callback The callback to queue.
 * @param {QueueOptions} [options] The queue options.
 */
export function queue(selector, callback, { queueName = 'default' } = {}) {
    const { setTimeout } = getWindow();
    const nodes = parseNodes(selector);

    for (const node of nodes) {
        if (!queues.has(node)) {
            queues.set(node, new Map());
        }

        const queue = queues.get(node);
        const runningQueue = queue.has(queueName);

        if (!runningQueue) {
            queue.set(queueName, [
                (_) => new Promise((resolve) => {
                    setTimeout(resolve, 1);
                }),
            ]);
        }

        queue.get(queueName).push(callback);

        if (!runningQueue) {
            dequeue(node, { queueName });
        }
    }
};
