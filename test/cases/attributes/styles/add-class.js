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
        document.body.innerHTML = '<div id="test1"></div><div id="test2"></div>';
    });
};

/**
 * Registers shared addClass behavior tests.
 * @param {((args: [string, string|Array<string>, Array<string>?]) => void)} addClass The browser callback for addClass.
 */
export function addClassTests(addClass) {
    test('adds a class to all nodes', async ({ page }) => {
        await page.evaluate(addClass, ['div', 'test']);

        await expect(page.locator('#test1')).toHaveClass('test');
        await expect(page.locator('#test2')).toHaveClass('test');
    });

    test('parses classes from string', async ({ page }) => {
        await page.evaluate(addClass, ['div', 'test1 test2']);

        await expect(page.locator('#test1')).toHaveClass('test1 test2');
        await expect(page.locator('#test2')).toHaveClass('test1 test2');
    });

    test('parses classes from array', async ({ page }) => {
        await page.evaluate(addClass, ['div', [
            'test1',
            'test2',
        ]]);

        await expect(page.locator('#test1')).toHaveClass('test1 test2');
        await expect(page.locator('#test2')).toHaveClass('test1 test2');
    });

    test('parses classes from multiple arguments', async ({ page }) => {
        await page.evaluate(addClass, ['div', 'test1', ['test2']]);

        await expect(page.locator('#test1')).toHaveClass('test1 test2');
        await expect(page.locator('#test2')).toHaveClass('test1 test2');
    });

    test('works with empty strings', async ({ page }) => {
        await page.evaluate(addClass, ['div', '']);

        expect(await page.locator('#test1').getAttribute('class')).toBeNull();
        expect(await page.locator('#test2').getAttribute('class')).toBeNull();
    });
}
