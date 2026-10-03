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
        document.body.innerHTML =
            '<div id="div1" class="test"></div>' +
            '<div id="div2"></div>' +
            '<div id="div3" class="test"></div>' +
            '<div id="div4"></div>';
        document.getElementById('div1').attachShadow({ mode: 'open' });
        document.getElementById('div3').attachShadow({ mode: 'closed' });
    });
};

/**
 * Registers shared hasShadow behavior tests.
 * @param {((nodes: string) => boolean)} hasShadow The browser callback for hasShadow.
 */
export function hasShadowTests(hasShadow) {
    test('returns true if any node has a shadow root', async ({ page }) => {
        expect(await page.evaluate(hasShadow, 'div')).toBe(true);
    });

    test('returns false if no nodes have a shadow root', async ({ page }) => {
        expect(await page.evaluate(hasShadow, 'div:not(.test)')).toBe(false);
    });

    test('returns false for closed shadow roots', async ({ page }) => {
        expect(await page.evaluate(hasShadow, '#div3')).toBe(false);
    });
}
