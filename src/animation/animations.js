/** @import { AnimationOptions } from './animation.js'; */
/** @import { ElementInput } from '../helpers.js'; */

import { evaluate, getDomProperty } from '@fr0st/core';
import { assertStyleUnlocked, setStyleLock } from './../attributes/style-locks.js';
import { css } from './../attributes/styles.js';
import { parseNodes } from './../filters.js';
import AnimationSet from './animation-set.js';
import Animation from './animation.js';
import { start } from './helpers.js';

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
            setAnimationStyle(
                getDomProperty(node, 'style'),
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
            setAnimationStyle(
                getDomProperty(node, 'style'),
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
            setAnimationStyle(getDomProperty(node, 'style'), 'transform', `rotate3d(${options.x}, ${options.y}, ${options.z}, ${amount}deg)`);
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
            setAnimationStyle(getDomProperty(node, 'style'), 'transform', `rotate3d(${options.x}, ${options.y}, ${options.z}, ${amount}deg)`);
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
    return animateSlide(selector, options, false);
};

/**
 * Slides each node out from a direction.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {AnimationOptions} [options] The animation options.
 * @returns {AnimationSet} A new AnimationSet that resolves when the animation has completed.
 */
export function slideOut(selector, options) {
    return animateSlide(selector, options, true);
};

/**
 * Squeezes each node in from a direction.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {AnimationOptions} [options] The animation options.
 * @returns {AnimationSet} A new AnimationSet that resolves when the animation has completed.
 */
export function squeezeIn(selector, options) {
    return animateSqueeze(selector, options, false);
};

/**
 * Squeezes each node out from a direction.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {AnimationOptions} [options] The animation options.
 * @returns {AnimationSet} A new AnimationSet that resolves when the animation has completed.
 */
export function squeezeOut(selector, options) {
    return animateSqueeze(selector, options, true);
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
    const animations = parseNodes(selector).map((node) => {
        const releases = new WeakMap;
        let originals;
        let initialStyles;

        // Animation invokes both callbacks with the animation instance as this.
        return new Animation(node, function(node, progress, options) {
            if (!releases.has(this)) {
                const style = getDomProperty(node, 'style');

                for (const property of properties) {
                    assertStyleUnlocked(node, property);
                }

                const declarations = originals || properties.map((property) => ({
                    property,
                    value: style.getPropertyValue(property),
                    priority: style.getPropertyPriority(property),
                }));

                const locks = [];
                releases.set(this, locks);

                for (const { property, value, priority } of declarations) {
                    // Clones must acquire locks against the original declarations.
                    if (originals) {
                        style.setProperty(property, value, priority);
                    }

                    locks.push(setStyleLock(node, property, value, {
                        important: priority === 'important',
                    }));
                }

                originals ??= declarations;
                initialStyles ??= Object.fromEntries(
                    declarations.map(({ property, value }) => [property, value]),
                );
            }

            if (progress < 1) {
                callback(node, progress, options, initialStyles);
            }
        }, options, function(restore) {
            const locks = releases.get(this);

            if (!locks) {
                return;
            }

            for (const release of locks) {
                release({ restore });
            }

            releases.delete(this);
        });
    });

    start();

    return new AnimationSet(animations);
};

/**
 * Slides each node in or out from a direction.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {AnimationOptions|undefined} options The animation options.
 * @param {boolean} out Whether to animate out.
 * @returns {AnimationSet} A new AnimationSet that resolves when the animation has completed.
 */
function animateSlide(selector, options, out) {
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
                size = getDomProperty(node, 'clientHeight');
                axis = 'Y';
                inverse = dir === 'top';
            } else {
                size = getDomProperty(node, 'clientWidth');
                axis = 'X';
                inverse = dir === 'left';
            }

            const amount = out ? size * progress : size - (size * progress);
            const translateAmount = (amount * (inverse ? -1 : 1)).toFixed(2);
            setAnimationStyle(getDomProperty(node, 'style'), 'transform', `translate${axis}(${translateAmount}px)`);
        },
        options,
    );
};

/**
 * Squeezes each node in or out from a direction.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {AnimationOptions|undefined} options The animation options.
 * @param {boolean} out Whether to animate out.
 * @returns {AnimationSet} A new AnimationSet that resolves when the animation has completed.
 */
function animateSqueeze(selector, options, out) {
    options = {
        direction: 'bottom',
        ...options,
    };

    return animateEffect(
        selector,
        ['height', 'overflow-x', 'overflow-y', 'transform', 'width'],
        (node, progress, options, initialStyles) => {
            const style = getDomProperty(node, 'style');
            setAnimationStyle(style, 'height', initialStyles.height);
            setAnimationStyle(style, 'width', initialStyles.width);
            setAnimationStyle(style, 'overflow-x', 'hidden');
            setAnimationStyle(style, 'overflow-y', 'hidden');

            const dir = evaluate(options.direction);

            let size; let sizeStyle; let axis;
            if (['top', 'bottom'].includes(dir)) {
                size = parseFloat(css(node, 'height')) || 0;
                sizeStyle = 'height';
                if (dir === 'top') {
                    axis = 'Y';
                }
            } else {
                size = parseFloat(css(node, 'width')) || 0;
                sizeStyle = 'width';
                if (dir === 'left') {
                    axis = 'X';
                }
            }

            const amount = (out ? size - (size * progress) : size * progress).toFixed(2);

            setAnimationStyle(style, sizeStyle, `${amount}px`);

            if (axis) {
                const translateAmount = (size - amount).toFixed(2);
                setAnimationStyle(style, 'transform', `translate${axis}(${translateAmount}px)`);
            }
        },
        options,
    );
};

/**
 * Sets an animated style value while preserving its current inline priority.
 * @param {CSSStyleDeclaration} style The inline style declaration.
 * @param {string} property The CSS property name.
 * @param {string} value The animated value.
 */
function setAnimationStyle(style, property, value) {
    style.setProperty(property, value, style.getPropertyPriority(property));
};
