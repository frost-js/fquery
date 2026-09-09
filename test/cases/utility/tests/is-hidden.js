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
    await page.evaluate((_) => {
        document.body.innerHTML =
            '<div id="div1" class="test">' +
            '<span></span>' +
            '</div>' +
            '<div id="div2">' +
            '<span></span>' +
            '</div>' +
            '<div id="div3" class="test">' +
            '<span></span>' +
            '</div>' +
            '<div id="div4">' +
            '<span></span>' +
            '</div>';
    });
};

/**
 * Registers shared isHidden behavior tests.
 * @param {((nodes: string) => boolean)} isHidden The browser callback for isHidden.
 */
export function isHiddenTests(isHidden) {
    test('returns true if any node is hidden', async ({ page }) => {
        expect(await page.evaluate(isHidden, 'div')).toBe(true);
    });

    test('returns false if no nodes are hidden', async ({ page }) => {
        expect(await page.evaluate(isHidden, 'div:not(.test)')).toBe(false);
    });

    test('returns true if any node is a descendent of a hidden node', async ({ page }) => {
        expect(await page.evaluate(isHidden, 'span')).toBe(true);
    });

    test('returns false for visible fixed nodes', async ({ page }) => {
        await page.addStyleTag({ content: 'div { position: fixed; width: 10px; height: 10px; }' });

        expect(await page.evaluate(isHidden, 'div:not(.test)')).toBe(false);
    });

    test('returns true for fixed nodes with display none', async ({ page }) => {
        await page.addStyleTag({ content: 'div { position: fixed; width: 10px; height: 10px; }' });

        expect(await page.evaluate(isHidden, '.test')).toBe(true);
    });

    test('returns true for fixed descendents of hidden nodes', async ({ page }) => {
        await page.addStyleTag({ content: 'span { position: fixed; width: 10px; height: 10px; }' });

        expect(await page.evaluate(isHidden, '.test span')).toBe(true);
    });
}
