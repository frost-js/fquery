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
        document.body.innerHTML = '<input type="text" id="test1" required><input type="number" id="test2">';
    });
};

/**
 * Registers shared getAttribute behavior tests.
 * @param {((args: [string, string?]) => (Record<string, string>|string|null|undefined))} getAttribute The browser callback for getAttribute.
 */
export function getAttributeTests(getAttribute) {
    test('returns an object with all attributes for the first node', async ({ page }) => {
        const attributes = await page.evaluate(getAttribute, ['input']);

        expect(attributes).toEqual({
            type: 'text',
            id: 'test1',
            required: '',
        });
    });

    test('returns an attribute value for the first node', async ({ page }) => {
        const value = await page.evaluate(getAttribute, ['input', 'type']);

        expect(value).toBe('text');
    });

    test('returns null for an undefined property', async ({ page }) => {
        const value = await page.evaluate(getAttribute, ['input', 'disabled']);

        expect(value).toBe(null);
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        const value = await page.evaluate(getAttribute, ['#invalid', 'type']);

        expect(value).toBe(undefined);
    });
}
