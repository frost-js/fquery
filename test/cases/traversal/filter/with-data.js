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
        document.body.innerHTML = '<div id="div1"></div><div id="div2"></div><div id="div3"></div><div id="div4"></div>';
    });
    await page.evaluate(() => {
        $.setData('#div1', 'test1', 'Test 1');
        $.setData('#div3', 'test2', 'Test 2');
    });
};

/**
 * Registers shared withData behavior tests.
 * @param {((args: [string, string?]) => Array<string>)} withData The browser callback for withData.
 */
export function withDataTests(withData) {
    test('returns nodes with data', async ({ page }) => {
        const ids = await page.evaluate(withData, ['div']);

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });

    test('returns nodes with data for a key', async ({ page }) => {
        const ids = await page.evaluate(withData, ['div', 'test1']);

        expect(ids).toEqual([
            'div1',
        ]);
    });
}
