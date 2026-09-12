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
        document.body.innerHTML = '<div id="parent1" class="parent">Test 1<div id="child1"></div>Test 2</div><div id="parent2" class="parent">Test 3<div id="child2"></div>Test 4</div>';
    });
};

/**
 * Registers shared contents behavior tests.
 * @param {((nodes: string) => Array<string>)} contents The browser callback for contents.
 */
export function contentsTests(contents) {
    test('returns all children of each node', async ({ page }) => {
        const text = await page.evaluate(contents, '.parent');

        expect(text).toEqual([
            'Test 1',
            '',
            'Test 2',
            'Test 3',
            '',
            'Test 4',
        ]);
    });
}
