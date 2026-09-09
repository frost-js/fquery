/** @import { Page } from '@playwright/test'; */

import { expect, test } from '#test';

/**
 * Sets up the page for the shared and dedicated tests.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setup = async ({ page }) => {
    await page.addStyleTag({ content: '.test { position: fixed; }' });
    await page.evaluate(() => {
        document.body.innerHTML = '<div id="div1"><span id="span1"></span></div><div id="div2" class="test"><span id="span2"></span></div><div id="div3"><span id="span3"></span></div><div id="div4" class="test"><span id="span4"></span></div>';
    });
};

/**
 * Registers shared fixed behavior tests.
 * @param {((nodes: string) => Array<string>)} fixed The browser callback for fixed.
 */
export function fixedTests(fixed) {
    test('returns fixed nodes', async ({ page }) => {
        const ids = await page.evaluate(fixed, 'div');

        expect(ids).toEqual([
            'div2',
            'div4',
        ]);
    });

    test('returns descendents of fixed nodes', async ({ page }) => {
        const ids = await page.evaluate(fixed, 'span');

        expect(ids).toEqual([
            'span2',
            'span4',
        ]);
    });
}
