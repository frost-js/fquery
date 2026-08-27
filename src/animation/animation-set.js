/** @import Animation from './animation.js'; */
/** @import { StopAnimationOptions } from './animation.js'; */

/**
 * Represents a Promise-compatible collection of animations.
 */
export default class AnimationSet {
    #animations;
    #promise;

    /**
     * Creates an animation set.
     * @param {Animation[]} animations The animations.
     */
    constructor(animations) {
        this.#animations = animations;
        this.#promise = Promise.all(animations);
    }

    /**
     * Executes a callback if any of the animations is rejected.
     * @param {((reason: *) => *)} [onRejected] The callback to execute if an animation is rejected.
     * @returns {Promise<*>} The resulting promise.
     */
    catch(onRejected) {
        return this.#promise.catch(onRejected);
    }

    /**
     * Executes a callback once the animation is settled (resolved or rejected).
     * @param {(() => void)} [onFinally] The callback to execute once the animation set is settled.
     * @returns {Promise<Element[]>} The resulting promise.
     */
    finally(onFinally) {
        return this.#promise.finally(onFinally);
    }

    /**
     * Stops the animations.
     * @param {StopAnimationOptions} [options] The stopping options.
     */
    stop({ finish = true } = {}) {
        for (const animation of this.#animations) {
            animation.stop({ finish });
        }
    }

    /**
     * Executes a callback once the animation is resolved (or optionally rejected).
     * @param {((value: Element[]) => *)} onFulfilled The callback to execute if the animations resolve.
     * @param {((reason: *) => *)} [onRejected] The callback to execute if an animation is rejected.
     * @returns {Promise<*>} The resulting promise.
     */
    then(onFulfilled, onRejected) {
        return this.#promise.then(onFulfilled, onRejected);
    }
}

Object.setPrototypeOf(AnimationSet.prototype, Promise.prototype);
