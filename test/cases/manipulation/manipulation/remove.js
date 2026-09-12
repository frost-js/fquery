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
 * Registers shared remove behavior tests.
 * @param {((args: [string]) => void)} remove The browser callback for remove.
 */
export function removeTests(remove) {
    test('removes all nodes from the DOM', async ({ page }) => {
        await page.evaluate(remove, ['a']);

        await expect(page.locator('a')).toHaveCount(0);
        await expect(page.locator('#inner1')).toHaveCount(1);
        await expect(page.locator('#inner2')).toHaveCount(1);
        await expect(page.locator('#inner1').locator(':scope > *')).toHaveCount(0);
        await expect(page.locator('#inner2').locator(':scope > *')).toHaveCount(0);
    });
}
