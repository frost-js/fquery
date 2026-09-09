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
 * Registers shared rect behavior tests.
 * @param {((args: [string, { offset: boolean }?]) => (DOMRect|undefined))} rect The browser callback for rect.
 */
export function rectTests(rect) {
    test('returns the bounding rectangle of the first node', async ({ page }) => {
        expect(await page.evaluate(rect, ['div'])).toEqual({
            x: 600,
            y: 50,
            width: 200,
            height: 200,
            top: 50,
            right: 800,
            bottom: 250,
            left: 600,
        });
    });

    test('returns the bounding rectangle of the first node with offset', async ({ page }) => {
        expect(await page.evaluate(rect, ['div', { offset: true }])).toEqual({
            x: 1058,
            y: 1050,
            width: 200,
            height: 200,
            top: 1050,
            right: 1258,
            bottom: 1250,
            left: 1058,
        });
    });
}
