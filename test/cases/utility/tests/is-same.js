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
            '<div id="div1"></div>' +
            '<div id="div2"></div>' +
            '<div id="div3"></div>' +
            '<div id="div4"></div>';
    });
};

/**
 * Registers shared isSame behavior tests.
 * @param {((args: [NodeInput, NodeInput]) => boolean)} isSame The browser callback for isSame.
 */
export function isSameTests(isSame) {
    test('returns true if any node is identical to any other node', async ({ page }) => {
        expect(await page.evaluate(isSame, ['div', '#div2, #div4'])).toBe(true);
    });

    test('returns false if no nodes are identical to any other node', async ({ page }) => {
        expect(await page.evaluate(isSame, ['div', 'span'])).toBe(false);
    });

    test.describe('comparison inputs', () => {
        for (const [name, createArgs] of [
            ['HTMLElement', () => ['div', document.getElementById('div2')]],
            ['NodeList', () => ['div', document.querySelectorAll('#div2, #div4')]],
            ['HTMLCollection', () => ['div', document.body.children]],
            ['DocumentFragment', () => {
                const fragment = document.createDocumentFragment();

                return [[fragment], fragment];
            }],
            ['ShadowRoot', () => {
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });

                return [[shadow], shadow];
            }],
            ['array', () => ['div', [document.querySelector('#div2'), document.querySelector('#div4')]]],
        ]) {
            test(`works with ${name} other nodes`, async ({ page }) => {
                const args = await page.evaluateHandle(createArgs);

                expect(await page.evaluate(isSame, args)).toBe(true);
            });
        }
    });
}
