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
            '<div id="div1">' +
            '<a href="#" id="test1">Test</a>' +
            '<a href="#" id="test2">Test</a>' +
            '</div>';
    });
};

/**
 * Registers shared triggerOne behavior tests.
 * @param {((args: [string|Array<string>, string]) => (boolean|undefined))} triggerOne The browser callback for triggerOne.
 */
export function triggerOneTests(triggerOne) {
    test('returns undefined for an empty array', async ({ page }) => {
        expect(await page.evaluate(triggerOne, [[], 'click'])).toBe(undefined);
    });

    test('returns undefined for an unmatched selector', async ({ page }) => {
        expect(await page.evaluate(triggerOne, ['#invalid', 'click'])).toBe(undefined);
    });
}
