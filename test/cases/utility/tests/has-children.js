/** @import { Page } from '@playwright/test'; */

import { expect, test } from '#test';

/**
 * Sets up the page for the shared and dedicated tests.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setup = async ({ page }) => {
    await page.evaluate((_) => {
        document.body.innerHTML =
            '<div id="div1" class="test">' +
            '<span></span>' +
            '</div>' +
            '<div id="div2"></div>' +
            '<div id="div3" class="test">' +
            '<span></span>' +
            '</div>' +
            '<div id="div4"></div>';
    });
};

/**
 * Registers shared hasChildren behavior tests.
 * @param {((nodes: string) => boolean)} hasChildren The browser callback for hasChildren.
 */
export function hasChildrenTests(hasChildren) {
    test('returns true if any node has children', async ({ page }) => {
        expect(await page.evaluate(hasChildren, 'div')).toBe(true);
    });

    test('returns false if no nodes have children', async ({ page }) => {
        expect(await page.evaluate(hasChildren, 'div:not(.test)')).toBe(false);
    });
}
