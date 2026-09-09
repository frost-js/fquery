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
        document.body.innerHTML = '<div id="parent"><span id="span1"><a></a></span><span id="span2"><a></a></span><span id="span3" class="span"><a></a></span><span id="span4"><a></a></span></div><div id="parent2"><span id="span5"><a></a></span><span id="span6"><a></a></span><span id="span7" class="span"><a></a></span><span id="span8"><a></a></span></div>';
    });
};

/**
 * Registers shared prev behavior tests.
 * @param {((args: [string, string?]) => Array<string>)} prev The browser callback for prev.
 */
export function prevTests(prev) {
    test('returns the previous sibling of each node', async ({ page }) => {
        const ids = await page.evaluate(prev, ['.span']);

        expect(ids).toEqual([
            'span2',
            'span6',
        ]);
    });

    test('returns the previous sibling of each node matching a filter', async ({ page }) => {
        const ids = await page.evaluate(prev, ['.span', '#span6']);

        expect(ids).toEqual([
            'span6',
        ]);
    });
}
