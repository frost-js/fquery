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
        document.body.innerHTML = '<div id="test"></div>';
    });
};

/**
 * Registers shared attachShadow behavior tests.
 * @param {((args: [string, { open?: boolean }?]) => ShadowRoot)} attachShadow The browser callback for attachShadow.
 */
export function attachShadowTests(attachShadow) {
    test('attaches a shadow root to the first node', async ({ page }) => {
        const shadowRoot = await page.evaluateHandle(attachShadow, ['#test']);

        const result = await shadowRoot.evaluate((shadowRoot) => {
            return {
                returnedShadowRoot: shadowRoot instanceof ShadowRoot,
                elementShadowRoot: document.getElementById('test').shadowRoot instanceof ShadowRoot,
            };
        });

        expect(result).toEqual({
            returnedShadowRoot: true,
            elementShadowRoot: true,
        });
    });

    test('attaches a closed shadow root to the first node', async ({ page }) => {
        const shadowRoot = await page.evaluateHandle(attachShadow, ['#test', { open: false }]);

        const result = await shadowRoot.evaluate((shadowRoot) => {
            return {
                returnedShadowRoot: shadowRoot instanceof ShadowRoot,
                elementShadowRoot: document.getElementById('test').shadowRoot,
            };
        });

        expect(result).toEqual({
            returnedShadowRoot: true,
            elementShadowRoot: null,
        });
    });
}
