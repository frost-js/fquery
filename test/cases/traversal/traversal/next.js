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
        document.body.innerHTML = '<div id="parent"><span id="span1"><a></a></span><span id="span2" class="span"><a></a></span><span id="span3"><a></a></span><span id="span4"><a></a></span></div><div id="parent2"><span id="span5"><a></a></span><span id="span6" class="span"><a></a></span><span id="span7"><a></a></span><span id="span8"><a></a></span></div>';
    });
};

/**
 * Registers shared next behavior tests.
 * @param {((args: [string, string?]) => Array<string>)} next The browser callback for next.
 */
export function nextTests(next) {
    test('returns the next sibling of each node', async ({ page }) => {
        const ids = await page.evaluate(next, ['.span']);

        expect(ids).toEqual([
            'span3',
            'span7',
        ]);
    });

    test('returns the next sibling of each node matching a filter', async ({ page }) => {
        const ids = await page.evaluate(next, ['.span', '#span7']);

        expect(ids).toEqual([
            'span7',
        ]);
    });
}
