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
        document.body.innerHTML = '<div id="parent1"><span id="span1"><a></a></span><span id="span2"><a></a></span><span id="span3" class="span"><a></a></span><span id="span4"><a></a></span></div><div id="parent2"><span id="span5"><a></a></span><span id="span6"><a></a></span><span id="span7" class="span"><a></a></span><span id="span8"><a></a></span></div>';
    });
};

/**
 * Registers shared prevAll behavior tests.
 * @param {((args: [string, string?]) => Array<string>)} prevAll The browser callback for prevAll.
 */
export function prevAllTests(prevAll) {
    test('returns all previous siblings of each node', async ({ page }) => {
        const ids = await page.evaluate(prevAll, ['.span']);

        expect(ids).toEqual([
            'span1',
            'span2',
            'span5',
            'span6',
        ]);
    });

    test('returns all previous siblings of each node matching a filter', async ({ page }) => {
        const ids = await page.evaluate(prevAll, ['.span', '#span1, #span5']);

        expect(ids).toEqual([
            'span1',
            'span5',
        ]);
    });
}
