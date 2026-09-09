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
 * Registers shared getHTML behavior tests.
 * @param {((nodes: string) => (string|undefined))} getHTML The browser callback for getHTML.
 */
export function getHTMLTests(getHTML) {
    test('returns the HTML contents of the first node', async ({ page }) => {
        const html = await page.evaluate(getHTML, 'div');

        expect(html).toBe('<span>Test</span>');
    });

    test('reads form contents when a control shadows innerHTML', async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML = '<form><input name="innerHTML"><span>Test</span></form>';
        });

        const html = await page.evaluate(getHTML, 'form');

        expect(html).toBe('<input name="innerHTML"><span>Test</span>');
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        const html = await page.evaluate(getHTML, '#invalid');

        expect(html).toBe(undefined);
    });
}
