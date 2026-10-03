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
 * Registers shared center behavior tests.
 * @param {((args: [string, { offset: boolean }?]) => ({ x: number, y: number }|undefined))} center The browser callback for center.
 */
export function centerTests(center) {
    test('returns the center position of the first node', async ({ page }) => {
        expect(await page.evaluate(center, ['div'])).toEqual({
            x: 700,
            y: 150,
        });
    });

    test('returns the center position of the first node with offset', async ({ page }) => {
        expect(await page.evaluate(center, ['div', { offset: true }])).toEqual({
            x: 1158,
            y: 1150,
        });
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate(center, ['#invalid'])).toBe(undefined);
    });
}
