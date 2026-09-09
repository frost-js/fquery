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
        document.body.innerHTML = '<div id="test1" class="test1 test2"></div><div id="test2" class="test1 test2"></div>';
    });
};

/**
 * Registers shared removeClass behavior tests.
 * @param {((args: [string, string|Array<string>, Array<string>?]) => void)} removeClass The browser callback for removeClass.
 */
export function removeClassTests(removeClass) {
    test('removes a class from all nodes', async ({ page }) => {
        await page.evaluate(removeClass, ['div', 'test1']);

        await expect(page.locator('#test1')).toHaveClass('test2');
        await expect(page.locator('#test2')).toHaveClass('test2');
    });

    test('parses classes from string', async ({ page }) => {
        await page.evaluate(removeClass, ['div', 'test1 test2']);

        await expect(page.locator('#test1')).toHaveAttribute('class', '');
        await expect(page.locator('#test2')).toHaveAttribute('class', '');
    });

    test('parses classes from array', async ({ page }) => {
        await page.evaluate(removeClass, ['div', [
            'test1',
            'test2',
        ]]);

        await expect(page.locator('#test1')).toHaveAttribute('class', '');
        await expect(page.locator('#test2')).toHaveAttribute('class', '');
    });

    test('parses classes from multiple arguments', async ({ page }) => {
        await page.evaluate(removeClass, ['div', 'test1', ['test2']]);

        await expect(page.locator('#test1')).toHaveAttribute('class', '');
        await expect(page.locator('#test2')).toHaveAttribute('class', '');
    });

    test('works with empty strings', async ({ page }) => {
        await page.evaluate(removeClass, ['div', '']);

        await expect(page.locator('#test1')).toHaveClass('test1 test2');
        await expect(page.locator('#test2')).toHaveClass('test1 test2');
    });
}
