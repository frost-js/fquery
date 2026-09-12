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
            '<div id="dataParent">' +
            '<div id="test1" data-toggle="data"></div>' +
            '<div id="test2" data-toggle="data"></div>' +
            '</div>' +
            '<div id="noDataParent">' +
            '<div id="test3" data-toggle="noData"></div>' +
            '<div id="test4" data-toggle="noData"></div>' +
            '</div>';
        $.setData('#test1', 'test1', 'Test 1');
        $.setData('#test2', 'test2', 'Test 2');
    });
};

/**
 * Registers shared cloneData behavior tests.
 * @param {((args: [string, string]) => void)} cloneData The browser callback for cloneData.
 */
export function cloneDataTests(cloneData) {
    test('clones data from all nodes to all other nodes', async ({ page }) => {
        await page.evaluate(cloneData, ['[data-toggle="data"]', '[data-toggle="noData"]']);

        const data = await page.evaluate(() => [
            $.getData('#test3'),
            $.getData('#test4'),
        ]);

        expect(data).toEqual([
            {
                test1: 'Test 1',
                test2: 'Test 2',
            },
            {
                test1: 'Test 1',
                test2: 'Test 2',
            },
        ]);
    });

    test('preserves source values when selections overlap', async ({ page }) => {
        await page.evaluate(() => {
            $.setData('#test1', 'test', 'Test 1');
            $.setData('#test2', 'test', 'Test 2');
        });

        await page.evaluate(cloneData, ['[data-toggle="data"]', '#test2, #test3']);

        const data = await page.evaluate(() => [
            $.getData('#test2', 'test'),
            $.getData('#test3', 'test'),
        ]);

        expect(data).toEqual([
            'Test 2',
            'Test 2',
        ]);
    });

    test('clones data with a __proto__ key', async ({ page }) => {
        await page.evaluate(() => {
            $.setData('#test1', '__proto__', 'Test 1');
        });

        await page.evaluate(cloneData, ['#test1', '[data-toggle="noData"]']);

        const data = await page.evaluate(() => [
            $.getData('#test3', '__proto__'),
            $.getData('#test4', '__proto__'),
        ]);

        expect(data).toEqual([
            'Test 1',
            'Test 1',
        ]);
    });
}
