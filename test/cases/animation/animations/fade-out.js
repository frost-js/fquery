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
    await page.evaluate(() => {
        document.body.innerHTML =
            '<div id="test1"></div>' +
            '<div id="test2" class="animate"></div>' +
            '<div id="test3"></div>' +
            '<div id="test4" class="animate"></div>';
    });
};

/**
 * Registers shared fadeOut behavior tests.
 * @param {((args: [string, AnimationOptions]) => void)} fadeOut The browser callback for fadeOut.
 */
export function fadeOutTests(fadeOut) {
    test('adds a fade-out animation to each node', async ({ page }) => {
        await page.evaluate(fadeOut, ['.animate', {
            duration: 200,
            debug: true,
        }]);
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { opacity: '0.5' },
            },
            {
                selectors: ['#test1', '#test3'],
                styles: { opacity: '' },
            },
        ]);
        await advanceClock(page, 150);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { opacity: '' },
            },
        ]);
    });

    test.describe('timing and easing', () => {
        test('adds a fade-out animation to each node with duration', async ({ page }) => {
            await page.evaluate(fadeOut, ['.animate', {
                duration: 100,
                debug: true,
            }]);
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#test2', '#test4'],
                    progress: 0.5,
                    styles: { opacity: '0.5' },
                },
                {
                    selectors: ['#test1', '#test3'],
                    styles: { opacity: '' },
                },
            ]);
            await advanceClock(page, 100);
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test2', '#test3', '#test4'],
                    styles: { opacity: '' },
                },
            ]);
        });

        for (const [type, progress, opacity] of [
            ['linear', 0.5, '0.5'],
            ['ease-in', 0.25, '0.75'],
            ['ease-out', 0.7071067812, '0.29'],
        ]) {
            test(`adds a fade-out animation to each node (${type})`, async ({ page }) => {
                await page.evaluate(fadeOut, ['.animate', {
                    duration: 100,
                    type,
                    debug: true,
                }]);
                await advanceClock(page, 50);
                await expectAnimationState(page, [
                    {
                        selectors: ['#test2', '#test4'],
                        progress,
                        styles: { opacity },
                    },
                    {
                        selectors: ['#test1', '#test3'],
                        styles: { opacity: '' },
                    },
                ]);
                await advanceClock(page, 100);
                await expectAnimationState(page, [
                    {
                        selectors: ['#test1', '#test2', '#test3', '#test4'],
                        styles: { opacity: '' },
                    },
                ]);
            });
        }

        test('adds a fade-out animation to each node (infinite)', async ({ page }) => {
            await page.evaluate(fadeOut, ['.animate', {
                duration: 100,
                type: 'linear',
                infinite: true,
                debug: true,
            }]);
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#test2', '#test4'],
                    progress: 0.5,
                    styles: { opacity: '0.5' },
                },
                {
                    selectors: ['#test1', '#test3'],
                    styles: { opacity: '' },
                },
            ]);
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#test2', '#test4'],
                    progress: 0,
                    styles: { opacity: '1' },
                },
                {
                    selectors: ['#test1', '#test3'],
                    styles: { opacity: '' },
                },
            ]);
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#test2', '#test4'],
                    progress: 0.5,
                    styles: { opacity: '0.5' },
                },
                {
                    selectors: ['#test1', '#test3'],
                    styles: { opacity: '' },
                },
            ]);
        });
    });
}
