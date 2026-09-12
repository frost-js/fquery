/** @import { Page } from '@playwright/test'; */

import { expect, test } from '#test';

/**
 * Sets up the page for the shared and dedicated tests.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setup = async ({ page }) => {
    await page.addStyleTag({ content: '.test { transition: opacity 1s; }' });
    await page.evaluate(() => {
        document.body.innerHTML = '<div id="div1" class="test"></div><div id="div2"></div><div id="div3" class="test"></div><div id="div4"></div>';
    });
};

/**
 * Registers shared withCssTransition behavior tests.
 * @param {((nodes: string) => Array<string>)} withCssTransition The browser callback for withCssTransition.
 */
export function withCssTransitionTests(withCssTransition) {
    test('returns nodes with CSS transitions', async ({ page }) => {
        const ids = await page.evaluate(withCssTransition, 'div');

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });

    for (const [duration, expected] of [
        ['1s', ['div1', 'div3']],
        ['0s', []],
    ]) {
        test(`filters nodes with CSS transition durations of 0s, ${duration}`, async ({ page }) => {
            await page.addStyleTag({ content: '.test { transition: opacity 0s, transform ' + duration + '; }' });

            const ids = await page.evaluate(withCssTransition, 'div');

            expect(ids).toEqual(expected);
        });
    }
}
