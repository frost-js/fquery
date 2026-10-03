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
        document.body.innerHTML = '<input type="text" id="test1"><input type="number" id="test2">';
    });
    await page.evaluate(() => {
        document.getElementById('test1').test = 'Test 1';
        document.getElementById('test2').test = 'Test 2';
    });
};

/**
 * Registers shared getProperty behavior tests.
 * @param {((args: [string, string]) => unknown)} getProperty The browser callback for getProperty.
 */
export function getPropertyTests(getProperty) {
    test('returns a property value for the first node', async ({ page }) => {
        const value = await page.evaluate(getProperty, ['input', 'test']);

        expect(value).toBe('Test 1');
    });

    test('returns undefined for an undefined property', async ({ page }) => {
        const value = await page.evaluate(getProperty, ['input', 'invalid']);

        expect(value).toBe(undefined);
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        const value = await page.evaluate(getProperty, ['#invalid', 'test']);

        expect(value).toBe(undefined);
    });
}
