/** @import { AnimationOptions } from './animation.js'; */
/** @import AnimationSet from './animation-set.js'; */
/** @import { ElementInput } from '../helpers.js'; */

import { evaluate } from '@fr0st/core';
import { animate } from './animate.js';

/**
 * @typedef {Record<string, {priority: string, value: string}>} InlineStyles
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
            node.style.setProperty(
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
            node.style.setProperty(
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
            node.style.setProperty('transform', `rotate3d(${options.x}, ${options.y}, ${options.z}, ${amount}deg)`);
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
            node.style.setProperty('transform', `rotate3d(${options.x}, ${options.y}, ${options.z}, ${amount}deg)`);
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
        useGpu: true,
        ...options,
    };

    return animateEffect(
        selector,
        options.useGpu ?
            ['transform'] :
            ['margin-left', 'margin-top'],
        (node, progress, options) => {
            const dir = evaluate(options.direction);

            let size; let translateStyle; let inverse;
            if (['top', 'bottom'].includes(dir)) {
                size = node.clientHeight;
                translateStyle = options.useGpu ?
                    'Y' :
                    'margin-top';
                inverse = dir === 'top';
            } else {
                size = node.clientWidth;
                translateStyle = options.useGpu ?
                    'X' :
                    'margin-left';
                inverse = dir === 'left';
            }

            const translateAmount = ((size - (size * progress)) * (inverse ? -1 : 1)).toFixed(2);
            if (options.useGpu) {
                node.style.setProperty('transform', `translate${translateStyle}(${translateAmount}px)`);
            } else {
                node.style.setProperty(translateStyle, `${translateAmount}px`);
            }
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
        useGpu: true,
        ...options,
    };

    return animateEffect(
        selector,
        options.useGpu ?
            ['transform'] :
            ['margin-left', 'margin-top'],
        (node, progress, options) => {
            const dir = evaluate(options.direction);

            let size; let translateStyle; let inverse;
            if (['top', 'bottom'].includes(dir)) {
                size = node.clientHeight;
                translateStyle = options.useGpu ?
                    'Y' :
                    'margin-top';
                inverse = dir === 'top';
            } else {
                size = node.clientWidth;
                translateStyle = options.useGpu ?
                    'X' :
                    'margin-left';
                inverse = dir === 'left';
            }

            const translateAmount = (size * progress * (inverse ? -1 : 1)).toFixed(2);
            if (options.useGpu) {
                node.style.setProperty('transform', `translate${translateStyle}(${translateAmount}px)`);
            } else {
                node.style.setProperty(translateStyle, `${translateAmount}px`);
            }
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
        useGpu: true,
        ...options,
    };

    return animateEffect(
        selector,
        options.useGpu ?
            ['height', 'overflow', 'transform', 'width'] :
            ['height', 'margin-left', 'margin-top', 'overflow', 'width'],
        (node, progress, options, initialStyles) => {
            node.style.setProperty('height', initialStyles.height.value);
            node.style.setProperty('width', initialStyles.width.value);
            node.style.setProperty('overflow', 'hidden');

            const dir = evaluate(options.direction);

            let size; let sizeStyle; let translateStyle;
            if (['top', 'bottom'].includes(dir)) {
                size = node.clientHeight;
                sizeStyle = 'height';
                if (dir === 'top') {
                    translateStyle = options.useGpu ?
                        'Y' :
                        'margin-top';
                }
            } else {
                size = node.clientWidth;
                sizeStyle = 'width';
                if (dir === 'left') {
                    translateStyle = options.useGpu ?
                        'X' :
                        'margin-left';
                }
            }

            const amount = (size * progress).toFixed(2);

            node.style.setProperty(sizeStyle, `${amount}px`);

            if (translateStyle) {
                const translateAmount = (size - amount).toFixed(2);
                if (options.useGpu) {
                    node.style.setProperty('transform', `translate${translateStyle}(${translateAmount}px)`);
                } else {
                    node.style.setProperty(translateStyle, `${translateAmount}px`);
                }
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
        useGpu: true,
        ...options,
    };

    return animateEffect(
        selector,
        options.useGpu ?
            ['height', 'overflow', 'transform', 'width'] :
            ['height', 'margin-left', 'margin-top', 'overflow', 'width'],
        (node, progress, options, initialStyles) => {
            node.style.setProperty('height', initialStyles.height.value);
            node.style.setProperty('width', initialStyles.width.value);
            node.style.setProperty('overflow', 'hidden');

            const dir = evaluate(options.direction);

            let size; let sizeStyle; let translateStyle;
            if (['top', 'bottom'].includes(dir)) {
                size = node.clientHeight;
                sizeStyle = 'height';
                if (dir === 'top') {
                    translateStyle = options.useGpu ?
                        'Y' :
                        'margin-top';
                }
            } else {
                size = node.clientWidth;
                sizeStyle = 'width';
                if (dir === 'left') {
                    translateStyle = options.useGpu ?
                        'X' :
                        'margin-left';
                }
            }

            const amount = (size - (size * progress)).toFixed(2);

            node.style.setProperty(sizeStyle, `${amount}px`);

            if (translateStyle) {
                const translateAmount = (size - amount).toFixed(2);
                if (options.useGpu) {
                    node.style.setProperty('transform', `translate${translateStyle}(${translateAmount}px)`);
                } else {
                    node.style.setProperty(translateStyle, `${translateAmount}px`);
                }
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
    const initialStyles = new WeakMap;

    return animate(selector, (node, progress, options) => {
        if (!initialStyles.has(node)) {
            initialStyles.set(
                node,
                Object.fromEntries(
                    properties.map((property) => [
                        property,
                        {
                            priority: node.style.getPropertyPriority(property),
                            value: node.style.getPropertyValue(property),
                        },
                    ]),
                ),
            );
        }

        const styles = initialStyles.get(node);

        if (progress < 1) {
            callback(node, progress, options, styles);
            return;
        }

        for (const [property, { priority, value }] of Object.entries(styles)) {
            node.style.setProperty(property, value, priority);
        }
    }, options);
};
