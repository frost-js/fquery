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
            '<div class="outer1">' +
            '<div class="inner1">' +
            '<a href="#">Test</a>' +
            '<a href="#">Test</a>' +
            '</div>' +
            '</div>' +
            '<div class="outer2">' +
            '<div class="inner2">' +
            '<a href="#">Test</a>' +
            '<a href="#">Test</a>' +
            '</div>' +
            '</div>';
    });
};

/**
 * Registers shared replaceWith behavior tests.
 * @param {((args: [string, string]) => void)} replaceWith The browser callback for replaceWith.
 */
export function replaceWithTests(replaceWith) {
    test('replaces each node with other nodes', async ({ page }) => {
        await page.evaluate(replaceWith, ['div', 'a']);

        await expect(page.locator('body > a')).toHaveCount(8);
        await expect(page.locator('body > div')).toHaveCount(0);
    });

    test('works with HTML other nodes', async ({ page }) => {
        await page.evaluate(replaceWith, ['a', '<div><span class="test">Test</span></div>']);

        await expect(page.locator('a')).toHaveCount(0);
        await expect(page.locator('span.test')).toHaveCount(4);
    });
}
