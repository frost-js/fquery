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
        document.body.innerHTML = '<div id="test1"></div><div id="test2"></div>';
    });
};

/**
 * Registers shared setStyleLock behavior tests.
 * @param {((args: [string, string, string|number, { important: boolean }?]) => void)} setStyleLock The browser callback for setStyleLock.
 */
export function setStyleLockTests(setStyleLock) {
    test('sets a style value for all nodes', async ({ page }) => {
        await page.evaluate(setStyleLock, ['div', 'display', 'none']);

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: none;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'display: none;');
    });

    test('sets a style value with important', async ({ page }) => {
        await page.evaluate(setStyleLock, ['div', 'display', 'none', { important: true }]);

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: none !important;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'display: none !important;');
    });

    test('normalizes camelCase property names', async ({ page }) => {
        await page.evaluate(setStyleLock, ['#test1', 'marginTop', '10px']);

        await expect(page.locator('#test1')).toHaveAttribute('style', 'margin-top: 10px;');
    });

    test('converts number values to pixels', async ({ page }) => {
        await page.evaluate(setStyleLock, ['#test1', 'width', 100]);

        await expect(page.locator('#test1')).toHaveAttribute('style', 'width: 100px;');
    });
}
