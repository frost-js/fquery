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
        document.body.innerHTML = '<div id="test1"><span>Test</span></div><div id="test2"></div>';
    });
};

/**
 * Registers shared getText behavior tests.
 * @param {((nodes: string) => (string|undefined))} getText The browser callback for getText.
 */
export function getTextTests(getText) {
    test('returns the text contents of the first node', async ({ page }) => {
        const text = await page.evaluate(getText, 'div');

        expect(text).toBe('Test');
    });

    test('reads form contents when a control shadows textContent', async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML = '<form><input name="textContent"><span>Test</span></form>';
        });

        const text = await page.evaluate(getText, 'form');

        expect(text).toBe('Test');
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        const text = await page.evaluate(getText, '#invalid');

        expect(text).toBe(undefined);
    });
}
