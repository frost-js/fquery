/** @import { Page } from '@playwright/test'; */

import { expect, test } from '#test';

/**
 * Sets up the page for the shared and dedicated tests.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setup = async ({ page }) => {
    await page.evaluate((_) => {
        document.body.innerHTML =
            '<div id="div1" class="test"></div>' +
            '<div id="div2"></div>' +
            '<div id="div3" class="test"></div>' +
            '<div id="div4"></div>';
    });
};

/**
 * Registers shared is behavior tests.
 * @param {((args: [string, string]) => boolean)} is The browser callback for is.
 */
export function isTests(is) {
    test('returns true if any node matches a filter', async ({ page }) => {
        expect(await page.evaluate(is, ['div', '.test'])).toBe(true);
    });

    test('returns false if no nodes match a filter', async ({ page }) => {
        expect(await page.evaluate(is, ['div:not(.test)', '.test'])).toBe(false);
    });
}
