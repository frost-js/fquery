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
        document.body.innerHTML =
            '<div id="fromParent">' +
            '<div id="test1" data-toggle="from" style="display: block; width: 100px; height: 100px; margin: 1050px; padding: 50px;"></div>' +
            '<div id="test2" data-toggle="from" style="display: block; width: 100px; height: 100px; margin: 1050px; padding: 50px;"></div>' +
            '</div>' +
            '<div id="toParent">' +
            '<div id="test3" data-toggle="to"></div>' +
            '<div id="test4" data-toggle="to"></div>' +
            '</div>';
        window.scrollTo(1000, 1000);
    });
};

/**
 * Registers shared nearestToNode behavior tests.
 * @param {((args: [NodeInput, NodeInput]) => Array<string>)} nearestToNode The browser callback for nearestToNode.
 */
export function nearestToNodeTests(nearestToNode) {
    test('returns the nearest node to another node', async ({ page }) => {
        const result = await page.evaluate(nearestToNode, ['[data-toggle="from"]', '[data-toggle="to"]']);

        expect(result).toEqual(['test2']);
    });

    test.describe('comparison inputs', () => {
        for (const [name, createArgs] of [
            ['HTMLElement', () => ['[data-toggle="from"]', document.getElementById('test3')]],
            ['NodeList', () => ['[data-toggle="from"]', document.querySelectorAll('[data-toggle="to"]')]],
            ['HTMLCollection', () => ['[data-toggle="from"]', document.getElementById('toParent').children]],
            ['array', () => ['[data-toggle="from"]', [document.getElementById('test3'), document.getElementById('test4')]]],
        ]) {
            test(`works with ${name} other nodes`, async ({ page }) => {
                const args = await page.evaluateHandle(createArgs);
                const result = await page.evaluate(nearestToNode, args);

                expect(result).toEqual(['test2']);
            });
        }
    });
}
