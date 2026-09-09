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
            '<div id="test1" style="display: block; width: 100px; overflow-x: scroll;">' +
            '<div style="display: block; width: 1000px; height: 1px;"></div>' +
            '</div>' +
            '<div id="test2"></div>';
        document.getElementById('test1').scrollLeft = 100;
    });
};

/**
 * Registers shared getScrollX behavior tests.
 * @param {((nodes: string) => (number|undefined))} getScrollX The browser callback for getScrollX.
 */
export function getScrollXTests(getScrollX) {
    test('returns the scroll X position of the first node', async ({ page }) => {
        expect(await page.evaluate(getScrollX, 'div')).toBe(100);
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate(getScrollX, '#invalid')).toBe(undefined);
    });
}
