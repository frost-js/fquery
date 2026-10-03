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
 * Registers shared hasAttribute behavior tests.
 * @param {((args: [string, string]) => boolean)} hasAttribute The browser callback for hasAttribute.
 */
export function hasAttributeTests(hasAttribute) {
    test('returns true if any node has a specified attribute', async ({ page }) => {
        expect(await page.evaluate(hasAttribute, ['div', 'class'])).toBe(true);
    });

    test('returns false if no nodes have a specified attribute', async ({ page }) => {
        expect(await page.evaluate(hasAttribute, ['div:not(.test)', 'class'])).toBe(false);
    });
}
