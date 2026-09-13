/** @import { Page } from '@playwright/test'; */
/** @import { blur } from '../../../../src/events/events.js'; */

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
            '<input type="text" id="test2">';
    });
};

/**
 * Registers shared blur behavior tests.
 * @param {() => typeof blur} createBlur Creates the browser-side method adapter.
 */
export function blurTests(createBlur) {
    test('triggers a blur event on the first node', async ({ page }) => {
        const operation = await page.evaluateHandle(createBlur);

        expect(await page.evaluate((operation) => {
            let result;
            const element = document.getElementById('test1');
            element.addEventListener('blur', (_) => {
                result = true;
            });
            element.focus();
            operation('input');
            return result;
        }, operation)).toBe(true);
    });
}
