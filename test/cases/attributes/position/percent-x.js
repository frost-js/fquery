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
            '<div id="test1" style="display: block; width: 100px; height: 100px; margin: 1050px; padding: 50px;"></div>' +
            '<div id="test2"></div>';
        window.scrollTo(1000, 1000);
    });
};

/**
 * Registers shared percentX behavior tests.
 * @param {((args: [string, number, { offset: boolean }?]) => (number|undefined))} percentX The browser callback for percentX.
 */
export function percentXTests(percentX) {
    test('returns the percent of a position along the X-axis for the first node', async ({ page }) => {
        expect(await page.evaluate(percentX, ['div', 700])).toBe(50);
    });

    test('returns the percent of a position along the X-axis for the first node with offset', async ({ page }) => {
        expect(await page.evaluate(percentX, ['div', 1158, { offset: true }])).toBe(50);
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate(percentX, ['#invalid', 700])).toBe(undefined);
    });
}
