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
    });
};

/**
 * Registers shared hasClass behavior tests.
 * @param {((args: [string, string]) => boolean)} hasClass The browser callback for hasClass.
 */
export function hasClassTests(hasClass) {
    test('returns true if any node has a specified class', async ({ page }) => {
        expect(await page.evaluate(hasClass, ['div', 'test'])).toBe(true);
    });

    test('returns false if no nodes have a specified class', async ({ page }) => {
        expect(await page.evaluate(hasClass, ['div:not(.test)', 'test'])).toBe(false);
    });
}
