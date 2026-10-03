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
            '<div id="test2" style="display: block; width: 100px; height: 100px; margin: 1050px; padding: 50px;"></div>';
        window.scrollTo(1000, 1000);
    });
};

/**
 * Registers shared nearestTo behavior tests.
 * @param {((args: [string, number, number, { offset: boolean }?]) => Array<string>)} nearestTo The browser callback for nearestTo.
 */
export function nearestToTests(nearestTo) {
    test('returns the nearest node to a position', async ({ page }) => {
        const result = await page.evaluate(nearestTo, ['div', 1000, 1000]);

        expect(result).toEqual(['test2']);
    });

    test('returns the nearest node to a position with offset', async ({ page }) => {
        const result = await page.evaluate(nearestTo, ['div', 1000, 1000, { offset: true }]);

        expect(result).toEqual(['test1']);
    });
}
