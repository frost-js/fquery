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
            '<div id="test1"></div>' +
            '<div id="test2"></div>';
        $.setData('#test1', 'test', 'Test 1');
    });
};

/**
 * Registers shared getData behavior tests.
 * @param {((args: [string, string?]) => unknown)} getData The browser callback for getData.
 */
export function getDataTests(getData) {
    test('returns an object with all data for the first node', async ({ page }) => {
        expect(await page.evaluate(getData, ['div'])).toEqual({
            test: 'Test 1',
        });
    });

    test('returns data for the first node', async ({ page }) => {
        expect(await page.evaluate(getData, ['div', 'test'])).toBe('Test 1');
    });

    test('returns undefined for an undefined key', async ({ page }) => {
        expect(await page.evaluate(getData, ['div', 'invalid'])).toBe(undefined);
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate(getData, ['#invalid', 'test'])).toBe(undefined);
    });
}
