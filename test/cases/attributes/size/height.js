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
            '<div id="test1" style="display: block; height: 1000px; width: 1200px; margin: 50px; padding: 25px; border: 1px solid grey; overflow-y: scroll;">' +
            '<div style="display: block; width: 1px; height: 2500px;"></div>' +
            '</div>' +
            '<div id="test2"></div>';
    });
};

/**
 * Registers shared height behavior tests.
 * @param {((nodes: string) => (number|undefined))} height The browser callback for height.
 */
export function heightTests(height) {
    test('returns the height of the first node', async ({ page }) => {
        expect(await page.evaluate(height, 'div')).toBe(1050);
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate(height, '#invalid')).toBe(undefined);
    });
}
