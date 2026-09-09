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
            '<div id="test1" style="display: block; height: 100px; overflow-y: scroll;">' +
            '<div style="display: block; width: 1px; height: 1000px;"></div>' +
            '</div>' +
            '<div id="test2"></div>';
        document.getElementById('test1').scrollTop = 100;
    });
};

/**
 * Registers shared getScrollY behavior tests.
 * @param {((nodes: string) => (number|undefined))} getScrollY The browser callback for getScrollY.
 */
export function getScrollYTests(getScrollY) {
    test('returns the scroll Y position of the first node', async ({ page }) => {
        expect(await page.evaluate(getScrollY, 'div')).toBe(100);
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate(getScrollY, '#invalid')).toBe(undefined);
    });
}
