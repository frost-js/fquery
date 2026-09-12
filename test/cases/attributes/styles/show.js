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
        document.body.innerHTML = '<div id="test1" style="display: none;"></div><div id="test2" style="display: none;"></div>';
    });
};

/**
 * Registers shared show behavior tests.
 * @param {((args: [string]) => void)} show The browser callback for show.
 */
export function showTests(show) {
    test('shows all nodes', async ({ page }) => {
        await page.evaluate(show, ['div']);

        await expect(page.locator('#test1')).toHaveAttribute('style', '');
        await expect(page.locator('#test2')).toHaveAttribute('style', '');
    });

    test.describe('display recovery', () => {
        for (const [name, prepareNode, display] of [
            ['block elements', () => {
                document.getElementById('test1').classList.add('hidden');
            }, 'block'],
            ['inline elements', () => {
                document.body.innerHTML = '<span id="test1" class="hidden">Test</span>';
            }, 'inline'],
            ['table rows', () => {
                document.body.innerHTML = '<table><tbody><tr id="test1" class="hidden"><td>Test</td></tr></tbody></table>';
            }, 'table-row'],
        ]) {
            test(`shows ${name} hidden by a stylesheet`, async ({ page }) => {
                await page.addStyleTag({ content: '.hidden { display: none; }' });
                await page.evaluate(prepareNode);
                await page.evaluate(show, ['#test1']);

                await expect(page.locator('#test1')).toHaveCSS('display', display);
            });
        }
    });
}
