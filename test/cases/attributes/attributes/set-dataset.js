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
 * Registers shared setDataset behavior tests.
 * @param {((args: [string, string|Record<string, unknown>, unknown?]) => void)} setDataset The browser callback for setDataset.
 */
export function setDatasetTests(setDataset) {
    test('sets a dataset object for all nodes', async ({ page }) => {
        await page.evaluate(setDataset, ['div', {
            testA: 'Test 1',
            testB: 'Test 2',
        }]);

        await expect(page.locator('#test1')).toHaveAttribute('data-test-a', 'Test 1');
        await expect(page.locator('#test1')).toHaveAttribute('data-test-b', 'Test 2');
        await expect(page.locator('#test2')).toHaveAttribute('data-test-a', 'Test 1');
        await expect(page.locator('#test2')).toHaveAttribute('data-test-b', 'Test 2');
    });

    test('sets a dataset value for all nodes', async ({ page }) => {
        await page.evaluate(setDataset, ['div', 'text', 'Test']);

        await expect(page.locator('#test1')).toHaveAttribute('data-text', 'Test');
        await expect(page.locator('#test2')).toHaveAttribute('data-text', 'Test');
    });

    test.describe('formatting', () => {
        for (const [type, key, value, expected] of [
            ['boolean true', 'true', true, 'true'],
            ['boolean false', 'false', false, 'false'],
            ['null', 'null', null, 'null'],
            ['array', 'array', [1, 2, 3], '[1,2,3]'],
            ['object', 'object', { a: 1 }, '{"a":1}'],
        ]) {
            for (const [overload, args] of [
                ['key/value', [key, value]],
                ['object', [{ [key]: value }]],
            ]) {
                test(`formats ${type} values (${overload})`, async ({ page }) => {
                    await page.evaluate(setDataset, ['#test1', ...args]);

                    await expect(page.locator('#test1')).toHaveAttribute(`data-${key}`, expected);
                    expect(await page.locator('#test2').getAttribute(`data-${key}`)).toBeNull();
                });
            }
        }
    });
}
