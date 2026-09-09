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
        document.body.innerHTML = '<div id="test1"></div><div id="test2" style="display: none;"></div>';
    });
};

/**
 * Registers shared toggle behavior tests.
 * @param {((args: [string, boolean?]) => void)} toggle The browser callback for toggle.
 */
export function toggleTests(toggle) {
    test('toggles the visibility of all nodes', async ({ page }) => {
        await page.evaluate(toggle, ['div']);

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: none;');
        await expect(page.locator('#test2')).toHaveAttribute('style', '');
    });

    test('shows all nodes when forced', async ({ page }) => {
        await page.evaluate(toggle, ['div', true]);

        await expect(page.locator('#test1')).toHaveCSS('display', 'block');
        await expect(page.locator('#test2')).toHaveCSS('display', 'block');
    });

    test('hides all nodes when forced', async ({ page }) => {
        await page.evaluate(toggle, ['div', false]);

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: none;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'display: none;');
    });
}
