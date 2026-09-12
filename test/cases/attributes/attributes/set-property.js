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
            '<input type="text" id="test1">' +
            '<input type="number" id="test2">';
    });
};

/**
 * Registers shared setProperty behavior tests.
 * @param {((args: [string, string|Record<string, unknown>, unknown?]) => void)} setProperty The browser callback for setProperty.
 */
export function setPropertyTests(setProperty) {
    test('sets a properties object for all nodes', async ({ page }) => {
        await page.evaluate(setProperty, ['input', {
            test1: 'Test 1',
            test2: 'Test 2',
        }]);

        expect(await page.locator('#test1').evaluate((element) => element.test1))
            .toBe('Test 1');
        expect(await page.locator('#test1').evaluate((element) => element.test2))
            .toBe('Test 2');
        expect(await page.locator('#test2').evaluate((element) => element.test1))
            .toBe('Test 1');
        expect(await page.locator('#test2').evaluate((element) => element.test2))
            .toBe('Test 2');
    });

    test('sets a property for all nodes', async ({ page }) => {
        await page.evaluate(setProperty, ['input', 'test', 'Test']);

        expect(await page.locator('#test1').evaluate((element) => element.test))
            .toBe('Test');
        expect(await page.locator('#test2').evaluate((element) => element.test))
            .toBe('Test');
    });
}
