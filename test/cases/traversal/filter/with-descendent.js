/** @import { Page } from '@playwright/test'; */

import { expect, test } from '#test';

/**
 * Sets up the page for the shared and dedicated tests.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setup = async ({ page }) => {
    await page.evaluate(() => {
        document.body.innerHTML = '<div id="div1"><span id="span1"><a id="a1"></a></span></div><div id="div2"></div><div id="div3"><span id="span2"><a id="a2"></a></span></div><div id="div4"></div>';
    });
};

/**
 * Registers shared withDescendent behavior tests.
 * @param {((args: [string, string?]) => Array<string>)} withDescendent The browser callback for withDescendent.
 */
export function withDescendentTests(withDescendent) {
    test('returns nodes with a descendent matching a filter', async ({ page }) => {
        const ids = await page.evaluate(withDescendent, ['div', 'a']);

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });

    test('returns nodes with a descendent without a filter', async ({ page }) => {
        const ids = await page.evaluate(withDescendent, ['div']);

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });
}
