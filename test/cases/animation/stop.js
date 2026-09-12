/** @import { Page } from '@playwright/test'; */
/** @import { StopAnimationOptions } from '../../../src/animation/animation.js'; */

import { expect, test } from '#test';
import { advanceClock } from '../../setup/browser.js';
import { expectAnimationState } from '../../support/assertions/animation.js';

/**
 * Sets up the page for the shared and dedicated tests.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setup = async ({ page }) => {
    await page.evaluate((_) => {
        document.body.innerHTML =
            '<div id="test1"></div>' +
            '<div id="test2" class="animate"></div>' +
            '<div id="test3"></div>' +
            '<div id="test4" class="animate"></div>';
    });
};

/**
 * Registers shared stop behavior tests.
 * @param {((args: [string, StopAnimationOptions?]) => void)} stop The browser callback for stop.
 */
export function stopTests(stop) {
    test('stops animations on all nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.animate(
                '.animate',
                (_) => { },
                {
                    duration: 100,
                    debug: true,
                },
            );
        });
        await advanceClock(page, 25);
        await page.evaluate(stop, ['.animate']);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
            },
        ]);
    });

    test('stops animations on all nodes (without finishing)', async ({ page }) => {
        await page.evaluate((_) => {
            $.animate(
                '.animate',
                (_) => { },
                {
                    duration: 100,
                    debug: true,
                },
            );
        });
        await advanceClock(page, 50);
        await page.evaluate(stop, ['.animate', { finish: false }]);
        const testHtml = await page.evaluate((_) => document.body.innerHTML);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
            },
        ]);
        await advanceClock(page, 25);
        const html = await page.evaluate((_) => document.body.innerHTML);
        expect(html).toBe(testHtml);
    });
}
