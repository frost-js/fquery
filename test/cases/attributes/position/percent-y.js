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
            '<div id="test1" style="display: block; width: 100px; height: 100px; margin: 1050px; padding: 50px;"></div>' +
            '<div id="test2"></div>';
        window.scrollTo(1000, 1000);
    });
};

/**
 * Registers shared percentY behavior tests.
 * @param {((args: [string, number, { offset: boolean }?]) => (number|undefined))} percentY The browser callback for percentY.
 */
export function percentYTests(percentY) {
    test('returns the percent of a position along the Y-axis for the first node', async ({ page }) => {
        expect(await page.evaluate(percentY, ['div', 150])).toBe(50);
    });

    test('returns the percent of a position along the Y-axis for the first node with offset', async ({ page }) => {
        expect(await page.evaluate(percentY, ['div', 1150, { offset: true }])).toBe(50);
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate(percentY, ['#invalid', 150])).toBe(undefined);
    });
}
