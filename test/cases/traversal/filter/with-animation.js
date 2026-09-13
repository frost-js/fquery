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
        document.body.innerHTML = '<div id="div1"></div><div id="div2"></div><div id="div3"></div><div id="div4"></div>';
        $.fadeIn('#div1', { duration: 100 });
        $.fadeIn('#div3', { duration: 100 });
    });

    await advanceClock(page, 20);
};

/**
 * Registers shared withAnimation behavior tests.
 * @param {(nodes: string) => Array<string>} withAnimation The browser callback for withAnimation.
 */
export function withAnimationTests(withAnimation) {
    test('returns nodes with animations', async ({ page }) => {
        expect(await page.evaluate(withAnimation, 'div')).toEqual([
            'div1',
            'div3',
        ]);

        await advanceClock(page, 100);

        expect(await page.evaluate(withAnimation, 'div')).toEqual([]);
    });
}
