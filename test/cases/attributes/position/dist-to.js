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
 * Registers shared distTo behavior tests.
 * @param {((args: [string, number, number, { offset: boolean }?]) => (number|undefined))} distTo The browser callback for distTo.
 */
export function distToTests(distTo) {
    test('returns the distance to the first node', async ({ page }) => {
        expect(await page.evaluate(distTo, ['div', 580, 128])).toBe(122);
    });

    test('returns the distance to the first node with offset', async ({ page }) => {
        expect(await page.evaluate(distTo, ['div', 1180, 1270, { offset: true }])).toBe(122);
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate(distTo, ['#invalid', 580, 128])).toBe(undefined);
    });
}
