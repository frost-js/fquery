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
    await page.evaluate(() => {
        document.body.innerHTML = '<div id="div1"></div><div id="div2"></div>';
    });
};

/**
 * Registers shared connected behavior tests.
 * @param {(nodes: NodeInput) => Array<string>} connected The browser callback for connected.
 */
export function connectedTests(connected) {
    test('returns nodes connected to the DOM', async ({ page }) => {
        const ids = await page.evaluate(connected, 'div');

        expect(ids).toEqual([
            'div1',
            'div2',
        ]);
    });

    test('filters out nodes not connected to the DOM', async ({ page }) => {
        const node = await page.evaluateHandle(() => document.createElement('div'));
        const nodes = await page.evaluate(connected, node);

        expect(nodes).toEqual([]);
    });
}
