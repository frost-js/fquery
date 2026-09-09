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
            '<div id="div2" class="test"></div>' +
            '<div id="div3"></div>' +
            '<div id="div4" class="test"></div>';
    });
};

/**
 * Registers shared indexOf behavior tests.
 * @param {((args: [string, string?]) => number)} indexOf The browser callback for indexOf.
 */
export function indexOfTests(indexOf) {
    test('returns the index of the first node', async ({ page }) => {
        expect(await page.evaluate(indexOf, ['div'])).toBe(0);
    });

    test('returns the index of the first node matching a filter', async ({ page }) => {
        expect(await page.evaluate(indexOf, ['div', '.test'])).toBe(1);
    });
}
