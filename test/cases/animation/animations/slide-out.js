/** @import { Page } from '@playwright/test'; */
/** @import { AnimationOptions } from '../../../../src/animation/animation.js'; */

import { test } from '#test';
import { advanceClock } from '../../../setup/browser.js';
import { expectAnimationState } from '../../../support/assertions/animation.js';

/**
 * Sets up the page for the shared and dedicated tests.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setup = async ({ page }) => {
    await page.addStyleTag({ content: 'div { width: 100px; height: 100px; }' });
    await page.evaluate((_) => {
        document.body.innerHTML =
            '<div id="test1"></div>' +
            '<div id="test2" class="animate"></div>' +
            '<div id="test3"></div>' +
            '<div id="test4" class="animate"></div>';
    });
};

/**
 * Registers shared slideOut behavior tests.
 * @param {((args: [string, AnimationOptions]) => void)} slideOut The browser callback for slideOut.
 */
export function slideOutTests(slideOut) {
    test('adds a slide-out animation to each node', async ({ page }) => {
        await page.evaluate(slideOut, ['.animate', {
            duration: 200,
            debug: true,
        }]);
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { transform: 'translateY(50px)' },
            },
            {
                selectors: ['#test1', '#test3'],
                styles: { transform: '' },
            },
        ]);
        await advanceClock(page, 150);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { transform: '' },
            },
        ]);
    });

    test.describe('timing and easing', () => {
        test('adds a slide-out animation to each node with duration', async ({ page }) => {
            await page.evaluate(slideOut, ['.animate', {
                duration: 100,
                debug: true,
            }]);
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test3'],
                    styles: { transform: '' },
                },
                {
                    selectors: ['#test2', '#test4'],
                    progress: 0.5,
                    styles: { transform: 'translateY(50px)' },
                },
            ]);
            await advanceClock(page, 100);
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test2', '#test3', '#test4'],
                    styles: { transform: '' },
                },
            ]);
        });

        for (const [type, progress, transform] of [
            ['linear', 0.5, 'translateY(50px)'],
            ['ease-in', 0.25, 'translateY(25px)'],
            ['ease-out', 0.7071067812, 'translateY(70.71px)'],
        ]) {
            test(`adds a slide-out animation to each node (${type})`, async ({ page }) => {
                await page.evaluate(slideOut, ['.animate', {
                    duration: 100,
                    type,
                    debug: true,
                }]);
                await advanceClock(page, 50);
                await expectAnimationState(page, [
                    {
                        selectors: ['#test1', '#test3'],
                        styles: { transform: '' },
                    },
                    {
                        selectors: ['#test2', '#test4'],
                        progress,
                        styles: { transform },
                    },
                ]);
                await advanceClock(page, 100);
                await expectAnimationState(page, [
                    {
                        selectors: ['#test1', '#test2', '#test3', '#test4'],
                        styles: { transform: '' },
                    },
                ]);
            });
        }

        test('adds a slide-out animation to each node (infinite)', async ({ page }) => {
            await page.evaluate(slideOut, ['.animate', {
                duration: 100,
                type: 'linear',
                infinite: true,
                debug: true,
            }]);
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test3'],
                    styles: { transform: '' },
                },
                {
                    selectors: ['#test2', '#test4'],
                    progress: 0.5,
                    styles: { transform: 'translateY(50px)' },
                },
            ]);
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test3'],
                    styles: { transform: '' },
                },
                {
                    selectors: ['#test2', '#test4'],
                    progress: 0,
                    styles: { transform: 'translateY(0px)' },
                },
            ]);
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test3'],
                    styles: { transform: '' },
                },
                {
                    selectors: ['#test2', '#test4'],
                    progress: 0.5,
                    styles: { transform: 'translateY(50px)' },
                },
            ]);
        });
    });

    test.describe('direction', () => {
        for (const [direction, transform] of [
            ['top', 'translateY(-50px)'],
            ['right', 'translateX(50px)'],
            ['bottom', 'translateY(50px)'],
            ['left', 'translateX(-50px)'],
        ]) {
            test(`adds a slide-out animation to each node (${direction})`, async ({ page }) => {
                await page.evaluate(slideOut, ['.animate', {
                    direction,
                    duration: 100,
                    debug: true,
                }]);
                await advanceClock(page, 50);
                await expectAnimationState(page, [
                    {
                        selectors: ['#test1', '#test3'],
                        styles: { transform: '' },
                    },
                    {
                        selectors: ['#test2', '#test4'],
                        progress: 0.5,
                        styles: { transform },
                    },
                ]);
                await advanceClock(page, 100);
                await expectAnimationState(page, [
                    {
                        selectors: ['#test1', '#test2', '#test3', '#test4'],
                        styles: { transform: '' },
                    },
                ]);
            });
        }

        test('adds a slide-out animation to each node (direction callback)', async ({ page }) => {
            const args = await page.evaluateHandle(() => ['.animate', {
                direction: (_) => 'top',
                duration: 100,
                debug: true,
            }]);
            await page.evaluate(slideOut, args);
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test3'],
                    styles: { transform: '' },
                },
                {
                    selectors: ['#test2', '#test4'],
                    progress: 0.5,
                    styles: { transform: 'translateY(-50px)' },
                },
            ]);
            await advanceClock(page, 100);
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test2', '#test3', '#test4'],
                    styles: { transform: '' },
                },
            ]);
        });
    });
}
