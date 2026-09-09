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
            '<div id="div1"></div>' +
            '<div id="div2"></div>' +
            '<div id="div3"></div>' +
            '<div id="div4"></div>';
    });
};

/**
 * Registers shared isSame behavior tests.
 * @param {((args: [string, string]) => boolean)} isSame The browser callback for isSame.
 */
export function isSameTests(isSame) {
    test('returns true if any node is identical to any other node', async ({ page }) => {
        expect(await page.evaluate(isSame, ['div', '#div2, #div4'])).toBe(true);
    });

    test('returns false if no nodes are identical to any other node', async ({ page }) => {
        expect(await page.evaluate(isSame, ['div', 'span'])).toBe(false);
    });
}
