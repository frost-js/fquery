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
        document.body.innerHTML =
            '<div id="div1" class="test"></div>' +
            '<div id="div2"></div>' +
            '<div id="div3" class="test"></div>' +
            '<div id="div4"></div>';
        $.setData('#div1', 'test1', 'Test 1');
        $.setData('#div3', 'test2', 'Test 2');
    });
};

/**
 * Registers shared hasData behavior tests.
 * @param {((args: [string, string?]) => boolean)} hasData The browser callback for hasData.
 */
export function hasDataTests(hasData) {
    test('returns true if any node has data', async ({ page }) => {
        expect(await page.evaluate(hasData, ['div'])).toBe(true);
    });

    test('returns false if no nodes have data', async ({ page }) => {
        expect(await page.evaluate(hasData, ['div:not(.test)'])).toBe(false);
    });

    test('returns true if any node has data for a key', async ({ page }) => {
        expect(await page.evaluate(hasData, ['#div1', 'test1'])).toBe(true);
    });

    test('returns false if no nodes have data for a key', async ({ page }) => {
        expect(await page.evaluate(hasData, ['#div1', 'test2'])).toBe(false);
    });
}
