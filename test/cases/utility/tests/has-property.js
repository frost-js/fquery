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
        document.getElementById('div1').test = 'Test 1';
        document.getElementById('div3').test = 'Test 2';
    });
};

/**
 * Registers shared hasProperty behavior tests.
 * @param {((args: [string, string]) => boolean)} hasProperty The browser callback for hasProperty.
 */
export function hasPropertyTests(hasProperty) {
    test('returns true if any node has a specified property', async ({ page }) => {
        expect(await page.evaluate(hasProperty, ['div', 'test'])).toBe(true);
    });

    test('returns false if no nodes have a specified property', async ({ page }) => {
        expect(await page.evaluate(hasProperty, ['div:not(.test)', 'test'])).toBe(false);
    });
}
