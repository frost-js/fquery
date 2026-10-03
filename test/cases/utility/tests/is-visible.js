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
        document.body.innerHTML =
            '<div id="div1">' +
            '<span></span>' +
            '</div>' +
            '<div id="div2" class="test">' +
            '<span></span>' +
            '</div>' +
            '<div id="div3">' +
            '<span></span>' +
            '</div>' +
            '<div id="div4" class="test">' +
            '<span></span>' +
            '</div>';
    });
};

/**
 * Registers shared isVisible behavior tests.
 * @param {((nodes: string) => boolean)} isVisible The browser callback for isVisible.
 */
export function isVisibleTests(isVisible) {
    test('returns true if any node is visible', async ({ page }) => {
        expect(await page.evaluate(isVisible, 'div')).toBe(true);
    });

    test('returns false if no nodes are visible', async ({ page }) => {
        expect(await page.evaluate(isVisible, '.test')).toBe(false);
    });

    test('returns true if any node is a descendent of a visible node', async ({ page }) => {
        expect(await page.evaluate(isVisible, 'span')).toBe(true);
    });

    test('returns true for visible fixed nodes', async ({ page }) => {
        await page.addStyleTag({ content: 'div { position: fixed; width: 10px; height: 10px; }' });

        expect(await page.evaluate(isVisible, 'div:not(.test)')).toBe(true);
    });

    test('returns false for fixed nodes with display none', async ({ page }) => {
        await page.addStyleTag({ content: 'div { position: fixed; width: 10px; height: 10px; }' });

        expect(await page.evaluate(isVisible, '.test')).toBe(false);
    });

    test('returns false for fixed descendents of hidden nodes', async ({ page }) => {
        await page.addStyleTag({ content: 'span { position: fixed; width: 10px; height: 10px; }' });

        expect(await page.evaluate(isVisible, '.test span')).toBe(false);
    });
}
