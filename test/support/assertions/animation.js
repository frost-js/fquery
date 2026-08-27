/** @import { Page } from '@playwright/test'; */

import { expect } from '@playwright/test';

/**
 * @typedef {object} AnimationStateExpectation
 * @property {string[]} selectors The selectors.
 * @property {number|null} [progress=null] The expected progress, or `null` if no animation data should exist.
 * @property {Record<string, string>} [styles] The expected inline styles.
 */

/**
 * Expects animation state on the matched nodes.
 * @param {Page} page The Playwright page.
 * @param {AnimationStateExpectation[]} expectations The expected animation states.
 * @returns {Promise<void>} The promise.
 */
export async function expectAnimationState(page, expectations) {
    const expectedStates = expectations.flatMap((expectation) =>
        expectation.selectors.map((selector) => ({
            selector,
            progress: expectation.progress ?? null,
            styles: expectation.styles,
        })),
    );
    const requests = expectedStates.map(({ selector, styles }) => ({
        selector,
        properties: styles ? Object.keys(styles) : [],
    }));
    const actualStates = await page.evaluate((requests) => {
        return requests.map(({ selector, properties }) => {
            const nodes = document.querySelectorAll(selector);
            const node = nodes.item(0);

            return {
                matches: nodes.length,
                animation: node ? {
                    progress: node.dataset.animationProgress,
                    start: node.dataset.animationStart,
                    time: node.dataset.animationTime,
                } : null,
                styles: node ? Object.fromEntries(
                    properties.map((property) => [property, node.style[property]]),
                ) : null,
            };
        });
    }, requests);

    for (const [index, expected] of expectedStates.entries()) {
        const actual = actualStates[index];
        const message = `Animation state for ${expected.selector}`;

        expect(actual.matches, `${message}: selector match count`).toBe(1);

        if (expected.progress === null) {
            expect(actual.animation, message).toEqual({
                progress: undefined,
                start: undefined,
                time: undefined,
            });
        } else {
            expect(actual.animation.progress, message).toBeDefined();
            expect(actual.animation.progress, message).not.toBe('');
            expect(Number(actual.animation.progress), message).toBeCloseTo(expected.progress, 10);
            expect(actual.animation.start, message).toBeDefined();
            expect(actual.animation.start, message).not.toBe('');
            expect(actual.animation.time, message).toBeDefined();
            expect(actual.animation.time, message).not.toBe('');
        }

        if (expected.styles) {
            expect(actual.styles, message).toEqual(expected.styles);
        }
    }
}
