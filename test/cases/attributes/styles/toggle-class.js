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
        document.body.innerHTML = '<div id="test1" class="test1 test2"></div><div id="test2"></div>';
    });
};

/**
 * Registers shared toggleClass behavior tests.
 * @param {((args: [string, string|Array<string>, Array<string>?]) => void)} toggleClass The browser callback for toggleClass.
 */
export function toggleClassTests(toggleClass) {
    test('toggles a class for all nodes', async ({ page }) => {
        await page.evaluate(toggleClass, ['div', 'test1']);

        await expect(page.locator('#test1')).toHaveClass('test2');
        await expect(page.locator('#test2')).toHaveClass('test1');
    });

    test('parses classes from string', async ({ page }) => {
        await page.evaluate(toggleClass, ['div', 'test1 test2']);

        await expect(page.locator('#test1')).toHaveAttribute('class', '');
        await expect(page.locator('#test2')).toHaveClass('test1 test2');
    });

    test('parses classes from array', async ({ page }) => {
        await page.evaluate(toggleClass, ['div', [
            'test1',
            'test2',
        ]]);

        await expect(page.locator('#test1')).toHaveAttribute('class', '');
        await expect(page.locator('#test2')).toHaveClass('test1 test2');
    });

    test('parses classes from multiple arguments', async ({ page }) => {
        await page.evaluate(toggleClass, ['div', 'test1', ['test2']]);

        await expect(page.locator('#test1')).toHaveAttribute('class', '');
        await expect(page.locator('#test2')).toHaveClass('test1 test2');
    });

    test('works with empty strings', async ({ page }) => {
        await page.evaluate(toggleClass, ['div', '']);

        await expect(page.locator('#test1')).toHaveClass('test1 test2');
        expect(await page.locator('#test2').getAttribute('class')).toBeNull();
    });
}
