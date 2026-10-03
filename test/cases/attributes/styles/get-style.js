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
        document.body.innerHTML = '<div id="test1" style="display: block; width: 100px; height: 100px;"></div><div id="test2"></div>';
    });
};

/**
 * Registers shared getStyle behavior tests.
 * @param {((args: [string, string]) => (string|undefined))} getStyle The browser callback for getStyle.
 */
export function getStyleTests(getStyle) {
    test('returns a style value for the first node', async ({ page }) => {
        await expect.poll(async () =>
            page.evaluate(getStyle, ['div', 'display'])).toBe('block');
    });

    test('returns a custom property', async ({ page }) => {
        await page.evaluate(() => {
            document.getElementById('test1').style.setProperty('--brandColor', 'red');
        });

        await expect.poll(async () =>
            page.evaluate(getStyle, ['#test1', '--brandColor'])).toBe('red');
    });

    test('returns an empty string for an undefined style', async ({ page }) => {
        await expect.poll(async () =>
            page.evaluate(getStyle, ['div', 'visibility'])).toBe('');
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate(getStyle, ['#invalid', 'display'])).toBe(undefined);
    });
}
