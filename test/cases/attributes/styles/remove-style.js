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
        document.body.innerHTML = '<div id="test1" style="background-color: blue; color: white;"></div><div id="test2" style="background-color: blue; color: white;"></div>';
    });
};

/**
 * Registers shared removeStyle behavior tests.
 * @param {((args: [string, string]) => void)} removeStyle The browser callback for removeStyle.
 */
export function removeStyleTests(removeStyle) {
    test('removes a style from all nodes', async ({ page }) => {
        await page.evaluate(removeStyle, ['div', 'color']);

        await expect(page.locator('#test1')).toHaveAttribute('style', 'background-color: blue;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'background-color: blue;');
    });

    test('removes a custom property', async ({ page }) => {
        await page.evaluate((_) => {
            for (const node of document.querySelectorAll('div')) {
                node.style.setProperty('--brandColor', 'red');
            }
        });

        await page.evaluate(removeStyle, ['div', '--brandColor']);

        await expect(page.locator('#test1')).toHaveAttribute('style', 'background-color: blue; color: white;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'background-color: blue; color: white;');
    });
}
