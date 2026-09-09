/** @import { AnimationOptions } from './animation.js'; */
/** @import AnimationSet from './animation-set.js'; */
/** @import { ElementInput } from '../helpers.js'; */

import { evaluate, getDOMProperty } from '@fr0st/core';
import { setStyleLock } from './../attributes/style-locks.js';
import { animate } from './animate.js';

/**
 * @typedef {Record<string, string>} InlineStyles
 */

/**
 * @callback AnimationEffectCallback
 * @param {Element} node The animated element.
 * @param {number} progress The animation progress from 0 to 1.
 * @param {AnimationOptions} options The resolved animation options.
 * @param {InlineStyles} initialStyles The initial inline styles.
 * @returns {void} Nothing.
 */

/**
 * Drops each node into place.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {AnimationOptions} [options] The animation options.
 * @returns {AnimationSet} A new AnimationSet that resolves when the animation has completed.
 */
export function dropIn(selector, options) {
    return slideIn(
        selector,
        {
            direction: 'top',
            ...options,
        },
    );
};

/**
 * Drops each node out of place.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {AnimationOptions} [options] The animation options.
 * @returns {AnimationSet} A new AnimationSet that resolves when the animation has completed.
 */
export function dropOut(selector, options) {
    return slideOut(
        selector,
        {
            direction: 'top',
            ...options,
        },
    );
};

/**
 * Fades the opacity of each node in.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {AnimationOptions} [options] The animation options.
 * @returns {AnimationSet} A new AnimationSet that resolves when the animation has completed.
 */
export function fadeIn(selector, options) {
    return animateEffect(
        selector,
        ['opacity'],
        (node, progress) =>
            getDOMProperty(node, 'style').setProperty(
                'opacity',
                progress.toFixed(2),
            ),
        options,
    );
};

/**
 * Fades the opacity of each node out.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {AnimationOptions} [options] The animation options.
 * @returns {AnimationSet} A new AnimationSet that resolves when the animation has completed.
 */
export function fadeOut(selector, options) {
    return animateEffect(
        selector,
        ['opacity'],
        (node, progress) =>
            getDOMProperty(node, 'style').setProperty(
                'opacity',
                (1 - progress).toFixed(2),
            ),
        options,
    );
};

/**
 * Rotates each node in on an X, Y or Z.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {AnimationOptions} [options] The animation options.
 * @returns {AnimationSet} A new AnimationSet that resolves when the animation has completed.
 */
export function rotateIn(selector, options) {
    return animateEffect(
        selector,
        ['transform'],
        (node, progress, options) => {
            const amount = ((90 - (progress * 90)) * (options.inverse ? -1 : 1)).toFixed(2);
            getDOMProperty(node, 'style').setProperty('transform', `rotate3d(${options.x}, ${options.y}, ${options.z}, ${amount}deg)`);
        },
        {
            x: 0,
            y: 1,
            z: 0,
            ...options,
        },
    );
};

/**
 * Rotates each node out on an X, Y or Z.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {AnimationOptions} [options] The animation options.
 * @returns {AnimationSet} A new AnimationSet that resolves when the animation has completed.
 */
export function rotateOut(selector, options) {
    return animateEffect(
        selector,
        ['transform'],
        (node, progress, options) => {
            const amount = ((progress * 90) * (options.inverse ? -1 : 1)).toFixed(2);
            getDOMProperty(node, 'style').setProperty('transform', `rotate3d(${options.x}, ${options.y}, ${options.z}, ${amount}deg)`);
        },
        {
            x: 0,
            y: 1,
            z: 0,
            ...options,
        },
    );
};

/**
 * Slides each node in from a direction.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {AnimationOptions} [options] The animation options.
 * @returns {AnimationSet} A new AnimationSet that resolves when the animation has completed.
 */
export function slideIn(selector, options) {
    options = {
        direction: 'bottom',
        ...options,
    };

    return animateEffect(
        selector,
        ['transform'],
        (node, progress, options) => {
            const dir = evaluate(options.direction);

            let size; let axis; let inverse;
            if (['top', 'bottom'].includes(dir)) {
                size = getDOMProperty(node, 'clientHeight');
                axis = 'Y';
                inverse = dir === 'top';
            } else {
                size = getDOMProperty(node, 'clientWidth');
                axis = 'X';
                inverse = dir === 'left';
            }

            const translateAmount = ((size - (size * progress)) * (inverse ? -1 : 1)).toFixed(2);
            getDOMProperty(node, 'style').setProperty('transform', `translate${axis}(${translateAmount}px)`);
        },
        options,
    );
};

/**
 * Slides each node out from a direction.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {AnimationOptions} [options] The animation options.
 * @returns {AnimationSet} A new AnimationSet that resolves when the animation has completed.
 */
export function slideOut(selector, options) {
    options = {
        direction: 'bottom',
        ...options,
    };

    return animateEffect(
        selector,
        ['transform'],
        (node, progress, options) => {
            const dir = evaluate(options.direction);

            let size; let axis; let inverse;
            if (['top', 'bottom'].includes(dir)) {
                size = getDOMProperty(node, 'clientHeight');
                axis = 'Y';
                inverse = dir === 'top';
            } else {
                size = getDOMProperty(node, 'clientWidth');
                axis = 'X';
                inverse = dir === 'left';
            }

            const translateAmount = (size * progress * (inverse ? -1 : 1)).toFixed(2);
            getDOMProperty(node, 'style').setProperty('transform', `translate${axis}(${translateAmount}px)`);
        },
        options,
    );
};

/**
 * Squeezes each node in from a direction.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {AnimationOptions} [options] The animation options.
 * @returns {AnimationSet} A new AnimationSet that resolves when the animation has completed.
 */
export function squeezeIn(selector, options) {
    options = {
        direction: 'bottom',
        ...options,
    };

    return animateEffect(
        selector,
        ['height', 'overflow-x', 'overflow-y', 'transform', 'width'],
        (node, progress, options, initialStyles) => {
            const style = getDOMProperty(node, 'style');
            style.setProperty('height', initialStyles.height);
            style.setProperty('width', initialStyles.width);
            style.setProperty('overflow-x', 'hidden');
            style.setProperty('overflow-y', 'hidden');

            const dir = evaluate(options.direction);

            let size; let sizeStyle; let axis;
            if (['top', 'bottom'].includes(dir)) {
                size = getDOMProperty(node, 'clientHeight');
                sizeStyle = 'height';
                if (dir === 'top') {
                    axis = 'Y';
                }
            } else {
                size = getDOMProperty(node, 'clientWidth');
                sizeStyle = 'width';
                if (dir === 'left') {
                    axis = 'X';
                }
            }

            const amount = (size * progress).toFixed(2);

            style.setProperty(sizeStyle, `${amount}px`);

            if (axis) {
                const translateAmount = (size - amount).toFixed(2);
                style.setProperty('transform', `translate${axis}(${translateAmount}px)`);
            }
        },
        options,
    );
};

/**
 * Squeezes each node out from a direction.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {AnimationOptions} [options] The animation options.
 * @returns {AnimationSet} A new AnimationSet that resolves when the animation has completed.
 */
export function squeezeOut(selector, options) {
    options = {
        direction: 'bottom',
        ...options,
    };

    return animateEffect(
        selector,
        ['height', 'overflow-x', 'overflow-y', 'transform', 'width'],
        (node, progress, options, initialStyles) => {
            const style = getDOMProperty(node, 'style');
            style.setProperty('height', initialStyles.height);
            style.setProperty('width', initialStyles.width);
            style.setProperty('overflow-x', 'hidden');
            style.setProperty('overflow-y', 'hidden');

            const dir = evaluate(options.direction);

            let size; let sizeStyle; let axis;
            if (['top', 'bottom'].includes(dir)) {
                size = getDOMProperty(node, 'clientHeight');
                sizeStyle = 'height';
                if (dir === 'top') {
                    axis = 'Y';
                }
            } else {
                size = getDOMProperty(node, 'clientWidth');
                sizeStyle = 'width';
                if (dir === 'left') {
                    axis = 'X';
                }
            }

            const amount = (size - (size * progress)).toFixed(2);

            style.setProperty(sizeStyle, `${amount}px`);

            if (axis) {
                const translateAmount = (size - amount).toFixed(2);
                style.setProperty('transform', `translate${axis}(${translateAmount}px)`);
            }
        },
        options,
    );
};

/**
 * Animates inline styles and restores their initial values on completion.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {string[]} properties The inline style properties changed by the animation.
 * @param {AnimationEffectCallback} callback The animation callback.
 * @param {AnimationOptions} [options] The animation options.
 * @returns {AnimationSet} A new AnimationSet that resolves when the animation has completed.
 */
function animateEffect(selector, properties, callback, options) {
    const states = new WeakMap;

    // Animation invokes both callbacks with the animation instance as this.
    return animate(selector, function(node, progress, options) {
        let state = states.get(this);

        if (!state) {
            const style = getDOMProperty(node, 'style');
            state = { styles: {}, releases: [] };
            states.set(this, state);

            for (const property of properties) {
                const priority = style.getPropertyPriority(property);
                const value = style.getPropertyValue(property);

                state.styles[property] = value;
                state.releases.push(setStyleLock(node, property, value, { important: priority === 'important' }));
            }
        }

        if (progress < 1) {
            callback(node, progress, options, state.styles);
        }
    }, options, function(restore) {
        const state = states.get(this);

        if (!state) {
            return;
        }

        for (const release of state.releases) {
            release({ restore });
        }

        states.delete(this);
    });
};
