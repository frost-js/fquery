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
            '<div id="test1" style="display: block; height: 1000px; width: 1200px; margin: 50px; padding: 25px; border: 1px solid grey; overflow-x: scroll">' +
            '<div style="display: block; height: 1px; width: 2500px;"></div>' +
            '</div>' +
            '<div id="test2"></div>';
    });
};

/**
 * Registers shared width behavior tests.
 * @param {((nodes: string) => (number|undefined))} width The browser callback for width.
 */
export function widthTests(width) {
    test('returns the width of the first node', async ({ page }) => {
        expect(await page.evaluate(width, 'div')).toBe(1250);
    });

    test('measures forms with a control named clientWidth', async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<form style="width: 100px; padding: 0; border: 0;">' +
                '<input type="hidden" name="clientWidth">' +
                '</form>';
        });

        expect(await page.evaluate(width, 'form')).toBe(100);
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate(width, '#invalid')).toBe(undefined);
    });
}
