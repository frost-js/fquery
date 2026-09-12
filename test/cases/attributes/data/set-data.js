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
 * Registers shared setData behavior tests.
 * @param {((args: [string, string|Record<string, unknown>, unknown?]) => void)} setData The browser callback for setData.
 */
export function setDataTests(setData) {
    test('sets a data object for all nodes', async ({ page }) => {
        await page.evaluate(setData, ['div', {
            testA: 'Test 1',
            testB: 'Test 2',
        }]);

        const data = await page.evaluate(() => [
            $.getData('#test1'),
            $.getData('#test2'),
        ]);

        expect(data).toEqual([
            {
                testA: 'Test 1',
                testB: 'Test 2',
            },
            {
                testA: 'Test 1',
                testB: 'Test 2',
            },
        ]);
    });

    test('sets data for all nodes', async ({ page }) => {
        await page.evaluate(setData, ['div', 'test', 'Test 1']);

        const data = await page.evaluate(() => [
            $.getData('#test1'),
            $.getData('#test2'),
        ]);

        expect(data).toEqual([
            {
                test: 'Test 1',
            },
            {
                test: 'Test 1',
            },
        ]);
    });

    test('stores __proto__ as a data key for all nodes', async ({ page }) => {
        await page.evaluate(setData, ['div', '__proto__', 'Test 1']);

        const data = await page.evaluate(() => [
            $.getData('#test1', '__proto__'),
            $.getData('#test2', '__proto__'),
        ]);

        expect(data).toEqual([
            'Test 1',
            'Test 1',
        ]);
    });
}
