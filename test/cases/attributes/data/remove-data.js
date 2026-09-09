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
            '<div id="test1"></div>' +
            '<div id="test2"></div>';
        $.setData('div', {
            testA: 'Test 1',
            testB: 'Test 2',
        });
    });
};

/**
 * Registers shared removeData behavior tests.
 * @param {((args: [string, string?]) => void)} removeData The browser callback for removeData.
 */
export function removeDataTests(removeData) {
    test('removes all data for all nodes', async ({ page }) => {
        await page.evaluate(removeData, ['div']);

        expect(await page.evaluate((_) => $.getData('#test1'))).toBeUndefined();
        expect(await page.evaluate((_) => $.getData('#test2'))).toBeUndefined();
    });

    test('removes data for all nodes', async ({ page }) => {
        await page.evaluate(removeData, ['div', 'testA']);

        expect(await page.evaluate((_) => $.getData('#test1'))).toEqual({
            testB: 'Test 2',
        });
        expect(await page.evaluate((_) => $.getData('#test2'))).toEqual({
            testB: 'Test 2',
        });
    });
}
