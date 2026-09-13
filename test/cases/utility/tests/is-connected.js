/** @import { Page } from '@playwright/test'; */
/** @import { NodeInput } from '../../../../src/helpers.js'; */

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
            '<div id="div1"></div>' +
            '<div id="div2"></div>' +
            '<div id="div3"></div>' +
            '<div id="div4"></div>';
    });
};

/**
 * Registers shared isConnected behavior tests.
 * @param {(nodes: NodeInput) => boolean} isConnected The browser callback for isConnected.
 */
export function isConnectedTests(isConnected) {
    test('returns true if any node is connected to the DOM', async ({ page }) => {
        expect(await page.evaluate(isConnected, 'div')).toBe(true);
    });

    test('returns false if no nodes are connected to the DOM', async ({ page }) => {
        const node = await page.evaluateHandle(() => document.createElement('div'));

        expect(await page.evaluate(isConnected, node)).toBe(false);
    });
}
