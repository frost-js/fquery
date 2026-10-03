/** @import { Page } from '@playwright/test'; */

import { expect, test } from '#test';
import { advanceClock, setupClock } from '../../../setup/browser.js';

/**
 * Sets up the page for the shared and dedicated tests.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setup = async ({ page }) => {
    await setupClock(page);

    await page.evaluate(() => {
        document.body.innerHTML =
            '<div id="div1" class="test"></div>' +
            '<div id="div2"></div>' +
            '<div id="div3" class="test"></div>' +
            '<div id="div4"></div>';
        $.fadeIn('.test', { duration: 100 });
    });

    await advanceClock(page, 20);
};

/**
 * Registers shared hasAnimation behavior tests.
 * @param {((nodes: string) => boolean)} hasAnimation The browser callback for hasAnimation.
 */
export function hasAnimationTests(hasAnimation) {
    test('returns true if any node has an animation', async ({ page }) => {
        expect(await page.evaluate(hasAnimation, 'div')).toBe(true);

        await advanceClock(page, 100);

        expect(await page.evaluate(hasAnimation, 'div')).toBe(false);
    });

    test('returns false if no nodes have an animation', async ({ page }) => {
        expect(await page.evaluate(hasAnimation, 'div:not(.test)')).toBe(false);
    });
}
