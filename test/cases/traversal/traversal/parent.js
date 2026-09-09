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
        document.body.innerHTML = '<div id="parent1"><div id="child1"><span id="span1"><a id="a1"></a></span></div></div><div id="parent2"><div id="child2"><span id="span2"><a id="a2"></a></span></div></div>';
    });
};

/**
 * Registers shared parent behavior tests.
 * @param {((args: [string, string?]) => Array<string>)} parent The browser callback for parent.
 */
export function parentTests(parent) {
    test('returns the parents of each node', async ({ page }) => {
        const ids = await page.evaluate(parent, ['a']);

        expect(ids).toEqual([
            'span1',
            'span2',
        ]);
    });

    test('returns the parents of each node matching a filter', async ({ page }) => {
        const ids = await page.evaluate(parent, ['a', '#span2']);

        expect(ids).toEqual([
            'span2',
        ]);
    });
}
