/** @import { Page } from '@playwright/test'; */

import { expect, test } from '#test';

/**
 * Sets up the page for the shared and dedicated tests.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setup = async ({ page }) => {
    await page.addStyleTag({ content: '.test { display: none; }' });
    await page.evaluate(() => {
        document.body.innerHTML = '<div id="div1"><span id="span1"></span></div><div id="div2" class="test"><span id="span2"></span></div><div id="div3"><span id="span3"></span></div><div id="div4" class="test"><span id="span4"></span></div>';
    });
};

/**
 * Registers shared hidden behavior tests.
 * @param {((nodes: string) => Array<string>)} hidden The browser callback for hidden.
 */
export function hiddenTests(hidden) {
    test('returns hidden nodes', async ({ page }) => {
        const ids = await page.evaluate(hidden, 'div');

        expect(ids).toEqual([
            'div2',
            'div4',
        ]);
    });

    test('returns descendents of hidden nodes', async ({ page }) => {
        const ids = await page.evaluate(hidden, 'span');

        expect(ids).toEqual([
            'span2',
            'span4',
        ]);
    });

    test('returns hidden fixed nodes', async ({ page }) => {
        await page.addStyleTag({ content: 'div { position: fixed; width: 10px; height: 10px; }' });

        const ids = await page.evaluate(hidden, 'div');

        expect(ids).toEqual([
            'div2',
            'div4',
        ]);
    });

    test('returns fixed descendents of hidden nodes', async ({ page }) => {
        await page.addStyleTag({ content: 'span { position: fixed; width: 10px; height: 10px; }' });

        const ids = await page.evaluate(hidden, 'span');

        expect(ids).toEqual([
            'span2',
            'span4',
        ]);
    });
}
