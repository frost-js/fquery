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
            '<div id="outer1">' +
            '<div id="inner1">' +
            '<a href="#" id="test1">Test</a>' +
            '<a href="#" id="test2">Test</a>' +
            '</div>' +
            '</div>' +
            '<div id="outer2">' +
            '<div id="inner2">' +
            '<a href="#" id="test3">Test</a>' +
            '<a href="#" id="test4">Test</a>' +
            '</div>' +
            '</div>';
    });
};

/**
 * Registers shared empty behavior tests.
 * @param {((args: [string]) => void)} empty The browser callback for empty.
 */
export function emptyTests(empty) {
    test('removes contents of all nodes from the DOM', async ({ page }) => {
        await page.evaluate(empty, ['div']);

        await expect(page.locator('body > div')).toHaveCount(2);
        await expect(page.locator('#outer1 > *')).toHaveCount(0);
        await expect(page.locator('#outer2 > *')).toHaveCount(0);
        await expect(page.locator('a')).toHaveCount(0);
    });
}
