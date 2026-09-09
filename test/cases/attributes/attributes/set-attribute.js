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
        document.body.innerHTML = '<input type="number" id="test1"><input type="number" id="test2">';
    });
};

/**
 * Registers shared setAttribute behavior tests.
 * @param {((args: [string, string|Record<string, string>, string?]) => void)} setAttribute The browser callback for setAttribute.
 */
export function setAttributeTests(setAttribute) {
    test('sets an attributes object for all nodes', async ({ page }) => {
        await page.evaluate(setAttribute, ['input', {
            min: '1',
            max: '10',
        }]);

        await expect(page.locator('#test1')).toHaveAttribute('min', '1');
        await expect(page.locator('#test1')).toHaveAttribute('max', '10');
        await expect(page.locator('#test2')).toHaveAttribute('min', '1');
        await expect(page.locator('#test2')).toHaveAttribute('max', '10');
    });

    test('sets an attribute for all nodes', async ({ page }) => {
        await page.evaluate(setAttribute, ['input', 'placeholder', '123']);

        await expect(page.locator('#test1')).toHaveAttribute('placeholder', '123');
        await expect(page.locator('#test2')).toHaveAttribute('placeholder', '123');
    });
}
