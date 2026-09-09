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
    await page.evaluate((_) => {
        document.body.innerHTML =
            '<div id="div1">' +
            '<span id="span1"></span>' +
            '</div>' +
            '<div id="div2" class="test">' +
            '<span id="span2"></span>' +
            '</div>' +
            '<div id="div3">' +
            '<span id="span3"></span>' +
            '</div>' +
            '<div id="div4" class="test">' +
            '<span id="span4"></span>' +
            '</div>';
    });
};

/**
 * Registers shared isFixed behavior tests.
 * @param {((nodes: string) => boolean)} isFixed The browser callback for isFixed.
 */
export function isFixedTests(isFixed) {
    test('returns true if any node is fixed', async ({ page }) => {
        expect(await page.evaluate(isFixed, 'div')).toBe(true);
    });

    test('returns false if no nodes are fixed', async ({ page }) => {
        expect(await page.evaluate(isFixed, 'div:not(.test)')).toBe(false);
    });

    test('returns true if any node is a descendent of a fixed node', async ({ page }) => {
        expect(await page.evaluate(isFixed, 'span')).toBe(true);
    });
}
