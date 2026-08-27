/** @import QuerySet from '../query-set.js'; */
/** @import { QueuedAnimationOptions } from '../../animation/animation.js'; */

import { dropIn as _dropIn, dropOut as _dropOut, fadeIn as _fadeIn, fadeOut as _fadeOut, rotateIn as _rotateIn, rotateOut as _rotateOut, slideIn as _slideIn, slideOut as _slideOut, squeezeIn as _squeezeIn, squeezeOut as _squeezeOut } from './../../animation/animations.js';

/**
 * Adds a drop in animation to the queue for each node.
 * @param {QueuedAnimationOptions} [options] The queued animation options.
 * @returns {QuerySet} The QuerySet object.
 */
export function dropIn({ queueName = 'default', ...options } = {}) {
    return this.queue((node) =>
        _dropIn(node, options),
    { queueName },
    );
};

/**
 * Adds a drop out animation to the queue for each node.
 * @param {QueuedAnimationOptions} [options] The queued animation options.
 * @returns {QuerySet} The QuerySet object.
 */
export function dropOut({ queueName = 'default', ...options } = {}) {
    return this.queue((node) =>
        _dropOut(node, options),
    { queueName },
    );
};

/**
 * Adds a fade in animation to the queue for each node.
 * @param {QueuedAnimationOptions} [options] The queued animation options.
 * @returns {QuerySet} The QuerySet object.
 */
export function fadeIn({ queueName = 'default', ...options } = {}) {
    return this.queue((node) =>
        _fadeIn(node, options),
    { queueName },
    );
};

/**
 * Adds a fade out animation to the queue for each node.
 * @param {QueuedAnimationOptions} [options] The queued animation options.
 * @returns {QuerySet} The QuerySet object.
 */
export function fadeOut({ queueName = 'default', ...options } = {}) {
    return this.queue((node) =>
        _fadeOut(node, options),
    { queueName },
    );
};

/**
 * Adds a rotate in animation to the queue for each node.
 * @param {QueuedAnimationOptions} [options] The queued animation options.
 * @returns {QuerySet} The QuerySet object.
 */
export function rotateIn({ queueName = 'default', ...options } = {}) {
    return this.queue((node) =>
        _rotateIn(node, options),
    { queueName },
    );
};

/**
 * Adds a rotate out animation to the queue for each node.
 * @param {QueuedAnimationOptions} [options] The queued animation options.
 * @returns {QuerySet} The QuerySet object.
 */
export function rotateOut({ queueName = 'default', ...options } = {}) {
    return this.queue((node) =>
        _rotateOut(node, options),
    { queueName },
    );
};

/**
 * Adds a slide in animation to the queue for each node.
 * @param {QueuedAnimationOptions} [options] The queued animation options.
 * @returns {QuerySet} The QuerySet object.
 */
export function slideIn({ queueName = 'default', ...options } = {}) {
    return this.queue((node) =>
        _slideIn(node, options),
    { queueName },
    );
};

/**
 * Adds a slide out animation to the queue for each node.
 * @param {QueuedAnimationOptions} [options] The queued animation options.
 * @returns {QuerySet} The QuerySet object.
 */
export function slideOut({ queueName = 'default', ...options } = {}) {
    return this.queue((node) =>
        _slideOut(node, options),
    { queueName },
    );
};

/**
 * Adds a squeeze in animation to the queue for each node.
 * @param {QueuedAnimationOptions} [options] The queued animation options.
 * @returns {QuerySet} The QuerySet object.
 */
export function squeezeIn({ queueName = 'default', ...options } = {}) {
    return this.queue((node) =>
        _squeezeIn(node, options),
    { queueName },
    );
};

/**
 * Adds a squeeze out animation to the queue for each node.
 * @param {QueuedAnimationOptions} [options] The queued animation options.
 * @returns {QuerySet} The QuerySet object.
 */
export function squeezeOut({ queueName = 'default', ...options } = {}) {
    return this.queue((node) =>
        _squeezeOut(node, options),
    { queueName },
    );
};
