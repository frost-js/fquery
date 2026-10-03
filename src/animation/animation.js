import { clamp, getDomProperty } from '@fr0st/core';
import { getAnimationDefaults } from '../config.js';
import { animations } from '../vars.js';
import { getTime } from './helpers.js';

/**
 * @typedef {'linear'|'ease-in'|'ease-out'|'ease-in-out'} AnimationType
 */

/**
 * @typedef {'top'|'right'|'bottom'|'left'|(() => string)} AnimationDirection
 */

/**
 * @typedef {object} AnimationOptions
 * @property {number} [duration=1000] The duration in milliseconds.
 * @property {AnimationType} [type='ease-in-out'] The easing type.
 * @property {boolean} [infinite=false] Whether to repeat indefinitely.
 * @property {boolean} [debug=false] Whether to expose timing data on the element.
 * @property {AnimationDirection} [direction] The animation direction.
 * @property {number} [x=0] The X-axis rotation component.
 * @property {number} [y=1] The Y-axis rotation component.
 * @property {number} [z=0] The Z-axis rotation component.
 * @property {boolean} [inverse=false] Whether to invert the rotation.
 * @property {number} [start] The animation start time.
 */

/**
 * @typedef {AnimationOptions & {queueName?: string}} QueuedAnimationOptions
 */

/**
 * @typedef {object} StopAnimationOptions
 * @property {boolean} [finish=true] Whether to finish the animation.
 */

/**
 * @callback AnimationCallback
 * @this {Animation}
 * @param {Element} node The animated element.
 * @param {number} progress The animation progress from 0 to 1.
 * @param {AnimationOptions} options The resolved animation options.
 * @returns {void} Nothing.
 */

/**
 * @callback AnimationCleanupCallback
 * @this {Animation}
 * @param {boolean} restore Whether to restore the original state.
 * @returns {void} Nothing.
 */

/**
 * Represents a single Promise-compatible element animation.
 */
export default class Animation {
    #callback;
    #cleanup;
    #isFinished;
    #isStopped;
    #isStopping;
    #node;
    #options;
    #promise;
    #reject;
    #resolve;

    /**
     * Creates an animation.
     * @param {Element} node The input node.
     * @param {AnimationCallback} callback The animation callback.
     * @param {AnimationOptions} [options] The animation options.
     * @param {AnimationCleanupCallback} [cleanup] Internal cleanup for built-in effects.
     */
    constructor(node, callback, options, cleanup) {
        this.#node = node;
        this.#callback = callback;
        this.#cleanup = cleanup;

        this.#options = {
            ...getAnimationDefaults(),
            ...options,
        };

        if (!('start' in this.#options)) {
            this.#options.start = getTime();
        }

        if (this.#options.debug) {
            getDomProperty(this.#node, 'dataset').animationStart = this.#options.start;
        }

        this.#promise = new Promise((resolve, reject) => {
            this.#resolve = resolve;
            this.#reject = reject;
        });

        if (!animations.has(node)) {
            animations.set(node, []);
        }

        animations.get(node).push(this);
    }

    /**
     * Executes a callback if the animation is rejected.
     * @param {((reason: *) => *)} [onRejected] The callback to execute if the animation is rejected.
     * @returns {Promise<*>} The resulting promise.
     */
    catch(onRejected) {
        return this.#promise.catch(onRejected);
    }

    /**
     * Clones the animation to a new node.
     * @param {Element} node The input node.
     * @returns {Animation} The cloned Animation.
     */
    clone(node) {
        return new Animation(node, this.#callback, this.#options, this.#cleanup);
    }

    /**
     * Executes a callback once the animation is settled (resolved or rejected).
     * @param {(() => void)} [onFinally] The callback to execute once the animation is settled.
     * @returns {Promise<Element>} The resulting promise.
     */
    finally(onFinally) {
        return this.#promise.finally(onFinally);
    }

    /**
     * Stops the animation.
     * @param {StopAnimationOptions} [options] The stopping options.
     */
    stop({ finish = true } = {}) {
        if (this.#isStopped || this.#isStopping || this.#isFinished) {
            return;
        }

        this.#isStopping = true;

        const otherAnimations = animations.get(this.#node)
            .filter((animation) => animation !== this);

        if (!otherAnimations.length) {
            animations.delete(this.#node);
        } else {
            animations.set(this.#node, otherAnimations);
        }

        if (finish) {
            this.update();
        }

        this.#isStopped = true;
        this.#isStopping = false;

        if (!finish) {
            this.#cleanup?.(false);
            this.#reject(this.#node);
        }
    }

    /**
     * Executes a callback once the animation is resolved (or optionally rejected).
     * @param {((value: Element) => *)} onFulfilled The callback to execute if the animation is resolved.
     * @param {((reason: *) => *)} [onRejected] The callback to execute if the animation is rejected.
     * @returns {Promise<*>} The resulting promise.
     */
    then(onFulfilled, onRejected) {
        return this.#promise.then(onFulfilled, onRejected);
    }

    /**
     * Runs a single frame of the animation.
     * @param {number} [time] The current time.
     * @returns {boolean} Whether the animation is finished.
     */
    update(time = null) {
        if (this.#isStopped || this.#isFinished) {
            return true;
        }

        let progress;

        if (time === null) {
            progress = 1;
        } else if (this.#options.duration === 0) {
            progress = time >= this.#options.start ? 1 : 0;
        } else {
            progress = (time - this.#options.start) / this.#options.duration;

            if (this.#options.infinite) {
                progress = Math.max(0, progress) % 1;
            } else {
                progress = clamp(progress);
            }

            if (this.#options.type === 'ease-in') {
                progress = progress ** 2;
            } else if (this.#options.type === 'ease-out') {
                progress = Math.sqrt(progress);
            } else if (this.#options.type === 'ease-in-out') {
                if (progress <= 0.5) {
                    progress = progress ** 2 * 2;
                } else {
                    progress = 1 - ((1 - progress) ** 2 * 2);
                }
            }
        }

        if (this.#options.debug) {
            const dataset = getDomProperty(this.#node, 'dataset');
            dataset.animationTime = time;
            dataset.animationProgress = progress;
        }

        try {
            this.#callback(this.#node, progress, this.#options);
        } catch (error) {
            if (this.#options.debug) {
                const dataset = getDomProperty(this.#node, 'dataset');
                delete dataset.animationStart;
                delete dataset.animationTime;
                delete dataset.animationProgress;
            }

            this.#isFinished = true;
            this.#cleanup?.(true);
            this.#reject(error);

            return true;
        }

        if (progress < 1) {
            return false;
        }

        if (this.#options.debug) {
            const dataset = getDomProperty(this.#node, 'dataset');
            delete dataset.animationStart;
            delete dataset.animationTime;
            delete dataset.animationProgress;
        }

        if (!this.#isFinished) {
            this.#isFinished = true;

            this.#cleanup?.(true);
            this.#resolve(this.#node);
        }

        return true;
    }
}

Object.setPrototypeOf(Animation.prototype, Promise.prototype);
