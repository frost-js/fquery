/** @import { Page } from '@playwright/test'; */

import { expect, test } from '#test';

/**
 * Sets up the page for the shared and dedicated tests.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setup = async ({ page }) => {
    await page.addStyleTag({
        content: '.test { animation: spin 4s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }',
    });
    await page.evaluate(() => {
        document.body.innerHTML = '<div id="div1" class="test"></div><div id="div2"></div><div id="div3" class="test"></div><div id="div4"></div>';
    });
};

/**
 * Registers shared withCssAnimation behavior tests.
 * @param {((nodes: string) => Array<string>)} withCssAnimation The browser callback for withCssAnimation.
 */
export function withCssAnimationTests(withCssAnimation) {
    test('returns nodes with CSS animations', async ({ page }) => {
        const ids = await page.evaluate(withCssAnimation, 'div');

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });

    for (const [duration, expected] of [
        ['1s', ['div1', 'div3']],
        ['0s', []],
    ]) {
        test(`filters nodes with CSS animation durations of 0s, ${duration}`, async ({ page }) => {
            await page.addStyleTag({ content: '.test { animation: spin 0s linear infinite, spin ' + duration + ' linear infinite; }' });

            const ids = await page.evaluate(withCssAnimation, 'div');

            expect(ids).toEqual(expected);
        });
    }
}
