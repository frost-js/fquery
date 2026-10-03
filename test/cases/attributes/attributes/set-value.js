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
            '<input type="text" id="test1">' +
            '<input type="text" id="test2">' +
            '<textarea id="test3"></textarea>' +
            '<select id="test4"><option value="1">1</option><option value="2">2</option></select>';
    });
};

/**
 * Registers shared setValue behavior tests.
 * @param {((args: [string, string|number]) => void)} setValue The browser callback for setValue.
 */
export function setValueTests(setValue) {
    test.describe('form controls', () => {
        test('sets the input value for all nodes', async ({ page }) => {
            await page.evaluate(setValue, ['input', 'Test']);

            expect(await page.evaluate(() => [
                document.getElementById('test1').value,
                document.getElementById('test2').value,
            ])).toEqual([
                'Test',
                'Test',
            ]);
        });

        test('works with textarea input nodes', async ({ page }) => {
            await page.evaluate(setValue, ['textarea', 'Test']);

            expect(await page.evaluate(() => document.getElementById('test3').value)).toBe('Test');
        });

        test('works with select input nodes', async ({ page }) => {
            await page.evaluate(setValue, ['select', 2]);

            expect(await page.evaluate(() => document.getElementById('test4').value)).toBe('2');
        });
    });
}
