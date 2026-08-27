/** @import { AnimationCallback } from '../../animation/animation.js'; */
/** @import QuerySet from '../query-set.js'; */
/** @import { QueuedAnimationOptions } from '../../animation/animation.js'; */
/** @import { StopAnimationOptions } from '../../animation/animation.js'; */

import { animate as _animate, stop as _stop } from './../../animation/animate.js';

/**
 * Adds an animation to the queue for each node.
 * @param {AnimationCallback} callback The animation callback.
 * @param {QueuedAnimationOptions} [options] The queued animation options.
 * @returns {QuerySet} The QuerySet object.
 */
export function animate(callback, { queueName = 'default', ...options } = {}) {
    return this.queue((node) =>
        _animate(node, callback, options),
    { queueName },
    );
};

/**
 * Stops all animations and clears the queue of each node.
 * @param {StopAnimationOptions} [options] The stopping options.
 * @returns {QuerySet} The QuerySet object.
 */
export function stop({ finish = true } = {}) {
    this.clearQueue();
    _stop(this, { finish });

    return this;
};
