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
            '<div id="div1" data-text="Test"></div>' +
            '<div id="div2"></div>' +
            '<div id="div3" data-text="Test"></div>' +
            '<div id="div4"></div>';
    });
};

/**
 * Registers shared hasDataset behavior tests.
 * @param {((args: [string, string]) => boolean)} hasDataset The browser callback for hasDataset.
 */
export function hasDatasetTests(hasDataset) {
    test('returns true if any node has a specified attribute', async ({ page }) => {
        expect(await page.evaluate(hasDataset, ['div', 'text'])).toBe(true);
    });

    test('returns true for an empty dataset value', async ({ page }) => {
        await page.evaluate(() => {
            document.getElementById('div2').setAttribute('data-empty', '');
        });

        expect(await page.evaluate(hasDataset, ['div', 'empty'])).toBe(true);
    });

    test('returns false if no nodes have a specified attribute', async ({ page }) => {
        expect(await page.evaluate(hasDataset, ['div:not([data-text])', 'text'])).toBe(false);
    });

    for (const key of ['constructor', 'toString']) {
        test(`returns false for an inherited ${key} property`, async ({ page }) => {
            expect(await page.evaluate(hasDataset, ['div', key])).toBe(false);
        });
    }
}
