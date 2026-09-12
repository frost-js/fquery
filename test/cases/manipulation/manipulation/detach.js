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
            '<div id="parent1">' +
            '<a href="#" id="test1">Test</a>' +
            '<a href="#" id="test2">Test</a>' +
            '</div>' +
            '<div id="parent2">' +
            '<a href="#" id="test3">Test</a>' +
            '<a href="#" id="test4">Test</a>' +
            '</div>';
    });
};

/**
 * Registers shared detach behavior tests.
 * @param {((args: [string]) => Array<Node>)} detach The browser callback for detach.
 */
export function detachTests(detach) {
    test('detaches all nodes from the DOM', async ({ page }) => {
        await page.evaluate(detach, ['a']);

        await expect(page.locator('#parent1 > *')).toHaveCount(0);
        await expect(page.locator('#parent2 > *')).toHaveCount(0);
    });

    test('returns detached nodes', async ({ page }) => {
        const nodes = await page.evaluateHandle(detach, ['a']);
        const ids = await nodes.evaluate((nodes) => nodes.map((node) => node.id));

        expect(ids).toEqual([
            'test1',
            'test2',
            'test3',
            'test4',
        ]);
    });
}
