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
 * Registers shared visible behavior tests.
 * @param {((nodes: string) => Array<string>)} visible The browser callback for visible.
 */
export function visibleTests(visible) {
    test('returns visible nodes', async ({ page }) => {
        const ids = await page.evaluate(visible, 'div');

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });

    test('returns descendents of visible nodes', async ({ page }) => {
        const ids = await page.evaluate(visible, 'span');

        expect(ids).toEqual([
            'span1',
            'span3',
        ]);
    });

    test('returns visible fixed nodes', async ({ page }) => {
        await page.addStyleTag({ content: 'div { position: fixed; width: 10px; height: 10px; }' });

        const ids = await page.evaluate(visible, 'div');

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });

    test('returns fixed descendents of visible nodes', async ({ page }) => {
        await page.addStyleTag({ content: 'span { position: fixed; width: 10px; height: 10px; }' });

        const ids = await page.evaluate(visible, 'span');

        expect(ids).toEqual([
            'span1',
            'span3',
        ]);
    });
}
