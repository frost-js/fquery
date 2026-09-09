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
            '<div id="fromParent">' +
            '<div id="test1" data-toggle="from" style="display: block; width: 100px; height: 100px; margin: 1050px; padding: 50px;"></div>' +
            '<div id="test2" data-toggle="from"></div>' +
            '</div>' +
            '<div id="toParent">' +
            '<div id="test3" data-toggle="to" style="display: block; width: 100px; height: 100px; margin: 1050px; padding: 50px;"></div>' +
            '<div id="test4" data-toggle="to"></div>' +
            '</div>';
        window.scrollTo(1000, 1000);
    });
};

/**
 * Registers shared distToNode behavior tests.
 * @param {((args: [string, string]) => (number|undefined))} distToNode The browser callback for distToNode.
 */
export function distToNodeTests(distToNode) {
    test('returns the distance from the first node to another node', async ({ page }) => {
        expect(await page.evaluate(distToNode, ['[data-toggle="from"]', '[data-toggle="to"]'])).toBe(1250);
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate(distToNode, ['#invalid', '[data-toggle="to"]'])).toBe(undefined);
    });

    test('returns undefined for empty other nodes', async ({ page }) => {
        expect(await page.evaluate(distToNode, ['[data-toggle="from"]', '#invalid'])).toBe(undefined);
    });
}
