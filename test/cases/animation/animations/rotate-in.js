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
    await page.evaluate(() => {
        document.body.innerHTML =
            '<div id="test1"></div>' +
            '<div id="test2" class="animate"></div>' +
            '<div id="test3"></div>' +
            '<div id="test4" class="animate"></div>';
    });
};

/**
 * Registers shared rotateIn behavior tests.
 * @param {((args: [string, AnimationOptions]) => void)} rotateIn The browser callback for rotateIn.
 */
export function rotateInTests(rotateIn) {
    test('adds a rotate-in animation to each node', async ({ page }) => {
        await page.evaluate(rotateIn, ['.animate', {
            duration: 200,
            debug: true,
        }]);
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
                styles: { transform: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { transform: 'rotate3d(0, 1, 0, 45deg)' },
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
        test('adds a rotate-in animation to each node with duration', async ({ page }) => {
            await page.evaluate(rotateIn, ['.animate', {
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
                    styles: { transform: 'rotate3d(0, 1, 0, 45deg)' },
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
            ['linear', 0.5, 'rotate3d(0, 1, 0, 45deg)'],
            ['ease-in', 0.25, 'rotate3d(0, 1, 0, 67.5deg)'],
            ['ease-out', 0.7071067812, 'rotate3d(0, 1, 0, 26.36deg)'],
        ]) {
            test(`adds a rotate-in animation to each node (${type})`, async ({ page }) => {
                await page.evaluate(rotateIn, ['.animate', {
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

        test('adds a rotate-in animation to each node (infinite)', async ({ page }) => {
            await page.evaluate(rotateIn, ['.animate', {
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
                    styles: { transform: 'rotate3d(0, 1, 0, 45deg)' },
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
                    styles: { transform: 'rotate3d(0, 1, 0, 90deg)' },
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
                    styles: { transform: 'rotate3d(0, 1, 0, 45deg)' },
                },
            ]);
        });
    });

    test.describe('direction', () => {
        for (const [name, axes, transform] of [
            ['X', { x: 1, y: 0 }, 'rotate3d(1, 0, 0, 45deg)'],
            ['Y', { y: 1 }, 'rotate3d(0, 1, 0, 45deg)'],
            ['Z', { y: 0, z: 1 }, 'rotate3d(0, 0, 1, 45deg)'],
            ['X,Y,Z', { x: 1, y: 1, z: 1 }, 'rotate3d(1, 1, 1, 45deg)'],
        ]) {
            test(`adds a rotate-in animation to each node (${name})`, async ({ page }) => {
                await page.evaluate(rotateIn, ['.animate', {
                    ...axes,
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

        test('adds a rotate-in animation to each node (inverse)', async ({ page }) => {
            await page.evaluate(rotateIn, ['.animate', {
                inverse: 1,
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
                    styles: { transform: 'rotate3d(0, 1, 0, -45deg)' },
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
