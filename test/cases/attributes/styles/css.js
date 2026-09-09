/** @import { Page } from '@playwright/test'; */

import { expect, test } from '#test';

/**
 * Sets up the page for the shared and dedicated tests.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setup = async ({ page }) => {
    await page.addStyleTag({ content: '.test { display: block; width: 50vw; }' });
    await page.evaluate(() => {
        document.body.innerHTML = '<div id="test1" class="test"></div><div id="test2" class="test"></div>';
    });
};

/**
 * Registers shared css behavior tests.
 * @param {((args: [string, string]) => (string|undefined))} css The browser callback for css.
 */
export function cssTests(css) {
    test('returns a computed style for the first node', async ({ page }) => {
        await expect.poll(async () => page.evaluate(css, ['.test', 'width'])).toBe('400px');
    });

    test('returns a computed custom property', async ({ page }) => {
        await page.addStyleTag({ content: '.test { --brandColor: red; }' });

        await expect.poll(async () => page.evaluate(css, ['.test', '--brandColor'])).toBe('red');
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate(css, ['#invalid', 'width'])).toBe(undefined);
    });
}
